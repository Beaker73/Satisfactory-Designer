import { Card, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Stack } from ".";

export interface CardProps 
{
	name: string,
	imagePath: string,
	footer: string,
}

export function Node(props: CardProps) 
{
	const { name, imagePath, footer } = props;
	const styles = useStyles();

	return <Card className={styles.node}>
		<Stack >
			<Stack.Item className={styles.header}>{name}</Stack.Item>
			<Stack.Item grow>
				<div className={styles.previewContainer}>
					<img className={styles.preview} src={imagePath} />
				</div>
			</Stack.Item>
			<Stack.Item className={styles.footer}>{footer}</Stack.Item>
		</Stack>
	</Card>;
}

const useStyles = makeStyles({
	header: {
		color: "white",
		zIndex: 1,
		...shorthands.margin("-12px"),
		...shorthands.padding("12px"),
		paddingTop: "6px",
		paddingBottom: "6px",
		backgroundColor: tokens.colorBackgroundOverlay,
		//...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1),
	},
	node: {
		width: "96px",
		height: "128px",
	},
	previewContainer: {
		position: "absolute",
		left: "0px",
		top: "0px",
		width: "96px",
		height: "64px",
	},
	preview: {
		marginLeft: "-16px",
		marginRight: "-16px",
		width: "128px",
		backgroundColor: tokens.colorNeutralForeground3,
	},
	footer: {
		color: "white",
		zIndex: 1,
		...shorthands.margin("-12px"),
		...shorthands.padding("12px"),
		paddingTop: "6px",
		paddingBottom: "6px",
		backgroundColor: tokens.colorBackgroundOverlay,
		//...shorthands.borderTop("1px", "solid", tokens.colorNeutralStroke1),
	},
});