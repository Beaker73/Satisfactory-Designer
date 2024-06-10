import { observer } from "mobx-react-lite";
import { Stack } from "./Stack";

export interface ErrorProps {
	message: string,
	error?: unknown,
}

export const ErrorMessage = observer((props: ErrorProps) =>
{
	return <Stack horizontal>
		<Stack.Item grow>&nbsp;</Stack.Item>
		<Stack.Item>
			<Stack>
				<Stack.Item grow>&nbsp;</Stack.Item>
				<Stack.Item>
					{props.message}
				</Stack.Item>
				{!!props.error && <Stack.Item>
					{errorMessage(props.error)}
				</Stack.Item>}
				<Stack.Item grow>&nbsp;</Stack.Item>
			</Stack>
		</Stack.Item>
		<Stack.Item grow>&nbsp;</Stack.Item>
	</Stack>;
});

function errorMessage(error: unknown) 
{
	if (typeof (error) === "string")
		return error;
	if (error instanceof Error)
		return error.message;
	if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string")
		return error.message;
	if (error)
		return error.toString();

	return undefined;
}