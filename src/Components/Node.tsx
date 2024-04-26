import { Body1, Button, Caption1, Card, CardHeader, makeStyles, shorthands } from "@fluentui/react-components";
import { WrenchFilled, WrenchRegular, bundleIcon } from "@fluentui/react-icons";
import { useDrag } from "react-dnd";


export interface CardProps {
	imagePath: string,
	name: string,
	description: string,
	onConfigClicked?(): void,
}

export function Node(props: CardProps) 
{
	const { name, imagePath, description, onConfigClicked } = props;
	const styles = useStyles();

	const [{ isDragging }, drag] = useDrag(() => ({
		type: "Node",
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const WrenchIcon = bundleIcon(WrenchFilled, WrenchRegular);

	return <Card className={styles.node} ref={drag}>
		<CardHeader
			image={<img className={styles.preview} src={imagePath} />}
			header={<Body1><b>{name}</b></Body1>}
			description={<Caption1>{description}</Caption1>}
			action={onConfigClicked && <Button icon={<WrenchIcon />} onClick={onConfigClicked} />}
		/>
		{/* <CardPreview></CardPreview>
		<CardFooter>
			<Button icon={<SquareIcon/>} />
			<Button icon={<SquareIcon/>} />
			<Button icon={<CircleIcon />} />
		</CardFooter> */}
	</Card>;
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
});