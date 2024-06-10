import { newGuid, type Guid } from "@/Model/Identifiers";
import { produce } from "immer";
import { observer } from "mobx-react-lite";
import type { Dispatch, FunctionComponent, PropsWithChildren } from "react";
import { Fragment, createContext, useCallback, useContext, useMemo, useReducer } from "react";

interface DialogItem {
	id: Guid,
	component: FunctionComponent<DialogControllerProps<unknown>>,
	props: object,
	resolve: (result: unknown) => void,
	reject: () => void,
}

interface DialogState {
	dialogs: DialogItem[],
}

interface DialogContext {
	dispatch: Dispatch<DialogAction>,
	state: DialogState,
}

const dialogContext = createContext<DialogContext>({ dispatch: () => { throw new Error("Missing dialog provider?"); }, state: { dialogs: [] } });

type DialogAction =
	| { action: "show", payload: DialogItem }
	| { action: "confirm", payload: { dialogId: Guid, result: unknown } }
	| { action: "dismiss", payload: { dialogId: Guid } }
	;

function dialogReducer(state: DialogState, action: DialogAction): DialogState 
{
	return produce(state, (mutableState: DialogState) => 
	{
		switch (action.action) 
		{
			case "show":
				mutableState.dialogs.push(action.payload);
				break;
			case "confirm":
				{
					const ix = mutableState.dialogs.findIndex(i => i.id === action.payload.dialogId);
					const removed = mutableState.dialogs.splice(ix, 1);
					removed[0].resolve(action.payload.result);
				}
				break;
			case "dismiss":
				{
					const ix = mutableState.dialogs.findIndex(i => i.id === action.payload.dialogId);
					const removed = mutableState.dialogs.splice(ix, 1);
					removed[0].reject();
				}
				break;
		}
	});


}

export const DialogProvider = observer((props: PropsWithChildren<unknown>) =>
{
	const [state, dispatch] = useReducer(dialogReducer, { dialogs: [] });
	const context = useMemo<DialogContext>(() => ({ dispatch, state }), [dispatch, state]);

	console.warn("dialog provider", { context });

	return <dialogContext.Provider value={context}>
		<DialogsRenderer />
		{props.children}
	</dialogContext.Provider>;
});

const DialogsRenderer = observer(() =>
{
	const { state, dispatch } = useContext(dialogContext);

	const onConfirm = useCallback((dialog: DialogItem, result: unknown) => { dispatch({ action: "confirm", payload: { dialogId: dialog.id, result } }); }, [dispatch]);
	const onDismiss = useCallback((dialog: DialogItem) => { dispatch({ action: "dismiss", payload: { dialogId: dialog.id } }); }, [dispatch]);

	return <Fragment>
		{state.dialogs.map(
			dialog => 
			{
				const Component = dialog.component;
				return <Component key={dialog.id} {...dialog.props} onConfirm={result => onConfirm(dialog, result)} onDismiss={() => onDismiss(dialog)} />;
			},
		)}
	</Fragment>;
});

export interface DialogControllerProps<Result = void> {
	onConfirm(result: Result): void;
	onDismiss(): void;
}

interface DialogController<
	Result = void, 
	DialogProps extends DialogControllerProps<Result> = DialogControllerProps<Result>, 
	DefaultProps extends Partial<DialogProps> = Record<keyof DialogProps, never>
> {
	/** show the dialog and return a promise that will resolve to the selected result */
	show(props: PartialIfAlreadyProvided<BareDialogProps<DialogProps, DefaultProps>, DefaultProps>): Promise<Result>;
}

type DialogProps<Component> = Component extends FunctionComponent<infer Props extends DialogControllerProps<infer _Result>> ? Props : FunctionComponent<DialogControllerProps<void>>;
type DialogResult<Props> = Props extends DialogControllerProps<infer Result> ? Result : void;

type PartialIfAlreadyProvided<A,B> = Omit<A,keyof B> & Partial<A>;
type BareDialogProps<Props, DefaultProps> = PartialIfAlreadyProvided<Omit<Props, "onConfirm" | "onDismiss">, DefaultProps>;

/**
 * Prepares a dialog component for dynamicly showing
 * @param component The dialog component
 * @returns Control to show the dialog dynamicly
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useDialog<
	Component extends FunctionComponent<Props>,
	Props extends DialogControllerProps<Result> = DialogProps<Component>,
	Result = DialogResult<Props>,
	const DefaultProps extends Partial<Props> = Record<keyof Props, never>,
>(
	component: Component,
	defaultProps?: DefaultProps,
)
	: DialogController<Result, Props, DefaultProps> 
{
	const context = useContext(dialogContext);

	const show = useCallback<(props: BareDialogProps<Props, DefaultProps>) => Promise<Result>>(
		async props => 
		{
			return new Promise<Result>((resolve, reject) => 
			{
				context.dispatch({
					action: "show",
					payload: {
						id: newGuid(),
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						component: component as FunctionComponent<any>,
						props: defaultProps ? { ...defaultProps, props } : props,
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						resolve: resolve as (result: any) => void,
						reject,
					},
				});
			});
		}, [component, context, defaultProps]);

	return useMemo<DialogController<Result, Props, DefaultProps>>(() => ({ show }), [show]);

}