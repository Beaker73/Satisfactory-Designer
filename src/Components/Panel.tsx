import { Body1, Button, Caption1, Card, CardHeader, Menu, MenuPopover, MenuTrigger, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { MoreVerticalFilled, MoreVerticalRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback, type ReactElement } from "react";
import { useDrag } from "react-dnd";
import { ContextPopup } from "./ContextPopup";


export interface PanelProps {
	dragKey: string,
	imageUrl?: string,
	name: string,
	description: string,
	commands?: ReactElement,
}

export function Panel(props: PanelProps) 
{
	const { dragKey, name, imageUrl, description, commands } = props;
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
		return <div className={styles.root}>
			<Card orientation="horizontal" className={styles.node} ref={drag}>
				<CardHeader
					image={imageUrl ? <img className={styles.preview} src={imageUrl} /> : undefined}
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
			</Card>
		</div>;
	}, [MoreIcon, commands, description, drag, imageUrl, name, styles.node, styles.preview, styles.root, styles.title]);

	if(commands) 
	{
		return <ContextPopup content={commands}>	
			{renderCard()}
		</ContextPopup>;
	}

	return renderCard();
}

const useStyles = makeStyles({
	root: {
		position: "relative", // set so child nodes that are absolute position, can be relative to this node
	},
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