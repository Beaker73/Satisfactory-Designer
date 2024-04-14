import { newGuid, type Guid } from "@/Model/Guid";
import { produce } from "immer";
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

export function DialogProvider(props: PropsWithChildren<unknown>) 
{
	const [state, dispatch] = useReducer(dialogReducer, { dialogs: [] });
	const context = useMemo<DialogContext>(() => ({ dispatch, state }), [dispatch, state]);

	console.warn("dialog provider", { context });

	return <dialogContext.Provider value={context}>
		<DialogsRenderer />
		{props.children}
	</dialogContext.Provider>;
}

function DialogsRenderer() 
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

}

export interface DialogControllerProps<Result = void> {
	onConfirm(result: Result): void;
	onDismiss(): void;
}

interface DialogController<Result = void, DialogProps extends DialogControllerProps<Result> = DialogControllerProps<Result>> {
	/** show the dialog and return a promise that will resolve to the selected result */
	show(props: BareDialogProps<DialogProps>): Promise<Result>;
}

type DialogProps<Component> = Component extends FunctionComponent<infer Props extends DialogControllerProps<infer _Result>> ? Props : FunctionComponent<DialogControllerProps<void>>;
type DialogResult<Props> = Props extends DialogControllerProps<infer Result> ? Result : void;
type BareDialogProps<Props> = Omit<Props, "onConfirm" | "onDismiss">;

/**
 * Prepares a dialog component for dynamicly showing
 * @param component The dialog component
 * @returns Control to show the dialog dynamicly
 */
export function useDialog<
	Component extends FunctionComponent<Props>,
	Props extends DialogControllerProps<Result> = DialogProps<Component>,
	Result = DialogResult<Props>
>(
	component: Component,
)
	: DialogController<Result, Props> 
{
	const context = useContext(dialogContext);
	console.debug({ context });

	const show = useCallback<(props: BareDialogProps<Props>) => Promise<Result>>(
		async props => 
		{
			return new Promise<Result>((resolve, reject) => 
			{
				context.dispatch({
					action: "show",
					payload: {
						id: newGuid(),
						component: component as FunctionComponent<any>,
						props,
						resolve: resolve as (result: any) => void,
						reject,
					},
				});
			});
		}, [component, context]);

	return useMemo<DialogController<Result, Props>>(() => ({ show }), [show]);

}