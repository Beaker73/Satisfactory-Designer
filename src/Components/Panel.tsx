import { Body1, Button, Caption1, Card, CardHeader, Menu, MenuPopover, MenuTrigger, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { MoreVerticalFilled, MoreVerticalRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback, type ReactElement } from "react";
import { useDrag } from "react-dnd";
import { ContextPopup } from "./ContextPopup";


export interface PanelProps {
	dragKey: string,
	imagePath: string,
	name: string,
	description: string,
	commands?: ReactElement,
}

export function Panel(props: PanelProps) 
{
	const { dragKey, name, imagePath, description, commands } = props;
	const styles = useStyles();

	const [{ isDragging: _ }, drag] = useDrag(() => ({
		type: "Node",
		item: { dragKey },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const MoreIcon = bundleIcon(MoreVerticalFilled, MoreVerticalRegular);

	const renderCard = useCallback(() => 
	{
		return <Card orientation="horizontal" className={styles.node} ref={drag}>
			<CardHeader
				image={<img className={styles.preview} src={imagePath} />}
				header={<Body1 className={styles.title}>{name}</Body1>}
				description={<Caption1>{description}</Caption1>}
				action={commands && <Menu>
					<MenuTrigger>
						<Button appearance="subtle" icon={<MoreIcon />} />
					</MenuTrigger>
					<MenuPopover>
						{commands}
					</MenuPopover>
				</Menu>}
			>
				
			</CardHeader>
		</Card>;
	}, [MoreIcon, commands, description, drag, imagePath, name, styles.node, styles.preview, styles.title]);

	if(commands) 
	{
		return <ContextPopup content={commands}>	
			{renderCard()}
		</ContextPopup>;
	}

	return renderCard();
}

const useStyles = makeStyles({
	node: {
		width: "256px",
		height: "64px",
	},
	preview: {
		height: "40px", // 32px + 2*4px
		...shorthands.margin("-4px"), // make image larger, but not container
	},
	title: {
		fontWeight: tokens.fontWeightSemibold,
	},
});