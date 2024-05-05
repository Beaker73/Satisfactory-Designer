import type { DialogControllerProps } from "@/Hooks/Dialogs";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from "@fluentui/react-components";

export interface RequestDialogProps extends DialogControllerProps<void> {
	title: string,
	message: string,
	okButton?: string,
	cancelButton?: string,
}

export function RequestDialog(props: RequestDialogProps) 
{
	const { title, message, okButton, cancelButton, onConfirm, onDismiss } = props;

	return <Dialog open={true}>
		<DialogSurface>
			<DialogBody>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>{message}</DialogContent>
				<DialogActions>
					<Button appearance="primary" onClick={() => onConfirm()}>{okButton}</Button>
					<Button appearance="secondary" onClick={onDismiss}>{cancelButton}</Button>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	</Dialog>;
}

export interface DialogButton {
	name: string,
	value: string,
	isDefault: boolean,
}