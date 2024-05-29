import type { NodeId } from "@/Model/Node";
import type { Position } from "@/Model/Position";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { type PropsWithChildren } from "react";
import { useDrag } from "react-dnd";

export interface DraggableProps
{
	dragKey: NodeId,
	position: Position,
}

export function Draggable(props: PropsWithChildren<DraggableProps>) 
{
	const { dragKey, children, position: [left, top] } = props;

	const [{ isDragging: _ }, dragSource] = useDrag(() => ({
		type: "Node",
		item: { dragKey },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const styles = useStyles();

	return <div ref={dragSource} className={styles.drag} style={{ left, top }}>
		{children}
	</div>;
}

const useStyles = makeStyles({
	drag: {
		position: "absolute",
		...shorthands.transition("left, top", tokens.durationUltraFast, "0s", "ease-in-out"),
	},
});