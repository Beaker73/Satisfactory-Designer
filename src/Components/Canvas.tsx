import { makeStyles, tokens } from "@fluentui/react-components";
import { useCallback } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";

import type { NodeId } from "@/Model/Node";
import { moveNodeByOffset } from "@/State/Actions/MoveNodeByOffset";

import { useProjectState } from "@/State";
import { Connector } from "./Connector";
import { Draggable } from "./Draggable";
import { NodeCard } from "./NodeCard";

export function Canvas() 
{
	const { state, dispatch } = useProjectState();
	const styles = useStyles();

	const onNodeDropped = useCallback(
		(dragProps: { dragKey: NodeId }, monitor: DropTargetMonitor<NodeId, void>) => 
		{
			const offset = monitor.getDifferenceFromInitialOffset();
			if (dragProps && offset)
				dispatch(moveNodeByOffset(dragProps.dragKey, offset));
		},
		[dispatch],
	);

	const [, drop] = useDrop({
		accept: "Node",
		drop: onNodeDropped,
	});

	//const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
	//const VariantIcon = bundleIcon(AppsListDetailFilled, AppsListDetailRegular);
	//const RecipeIcon = bundleIcon(BookTemplateFilled, BookTemplateRegular);

	return <div className={styles.root} ref={drop}>
		<div className={styles.canvas}>
			{Object.values(state.nodes).map(node => <Draggable key={node.id} dragKey={node.id} position={node.position}>
				<NodeCard key={node.id} nodeId={node.id} />
			</Draggable>)}
			{Object.values(state.links).map(link => 
			{
				let source = state.nodes[link.source].position;
				let target = state.nodes[link.target].position;

				source = [source[0]+256, source[1]+32];
				target = [target[0], target[1]+32];

				return <Connector key={link.id} source={source} target={target} value={link.itemsPerMinute} />;
			})}

			{/* <Connector source={[18*16, 4*16]} target={[22*16, 8*16]} value={60} tooltip="Copper 60 p/m" />
			<Connector source={[38*16, 8*16]} target={[22*16, 16*16]} value={60} tooltip="Copper 60 p/m" /> */}
		</div>
	</div>;
}


const useStyles = makeStyles({
	root: {
		position: "relative", // so children absolute are relative to this one
		width: "100%",
		height: "100%",
		backgroundColor: tokens.colorNeutralBackground4,
	},
	canvas: {
		position: "absolute",
		minWidth: "100%",
		minHeight: "100%",
		overflow: "scroll",
		backgroundSize: "16px 16px",
		backgroundImage: `
			linear-gradient(to right, #88888820 0.5px, transparent 1px),
			linear-gradient(to bottom, #88888820 0.5px, transparent 1px)
		`,
	},
});