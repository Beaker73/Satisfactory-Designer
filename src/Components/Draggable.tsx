import type { NodeId } from "@/ComputeModel/Node";
import type { DragNodeData } from "@/Model/DragData";
import type { Position } from "@/Model/Position";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { observer } from "mobx-react-lite";
import { type PropsWithChildren } from "react";
import { useDrag } from "react-dnd";

export interface DraggableProps {
	dragKey: NodeId,
	position: Position,
}

export const Draggable = observer((props: PropsWithChildren<DraggableProps>) => 
{
	const { dragKey, children, position } = props;

	const [_, dragSource] = useDrag<DragNodeData>(() => ({
		type: "node",
		item: { type: "node", dragKey },
	}));

	const styles = useStyles();

	return <div ref={dragSource} className={styles.drag} style={{ left: position.x, top: position.y }}>
		{children}
	</div>;
});

const useStyles = makeStyles({
	drag: {
		position: "absolute",
		...shorthands.transition("left, top", tokens.durationUltraFast, "0s", "ease-in-out"),
	},
});