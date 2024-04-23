import { Spinner } from "@fluentui/react-components";
import { Stack } from "./Stack";

export interface LoadingProps {
	message: string,
}

export function Loading(props: LoadingProps) 
{
	return <Stack horizontal>
		<Stack.Item grow>&nbsp;</Stack.Item>
		<Stack.Item>
			<Stack>
				<Stack.Item grow>&nbsp;</Stack.Item>
				<Stack.Item>
					<Spinner label={props.message} labelPosition="below" size="extra-large" />
				</Stack.Item>
				<Stack.Item grow>&nbsp;</Stack.Item>
			</Stack>
		</Stack.Item>
		<Stack.Item grow>&nbsp;</Stack.Item>
	</Stack>;
}