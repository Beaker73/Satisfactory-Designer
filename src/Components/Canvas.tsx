import { makeStyles, tokens } from "@fluentui/react-components";
import { useCallback } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";

import { useStoreActions, useStoreState } from "@/Store";

import type { NodeId } from "@/Model/Node";
import { Connector } from "./Connector";
import { Draggable } from "./Draggable";
import { NodeCard } from "./NodeCard";


export function Canvas() 
{
	const styles = useStyles();

	const nodes = useStoreState(state => state.nodes.allNodes);
	const { moveNodeByOffset } = useStoreActions(store => store.nodes);

	const onNodeDropped = useCallback(
		(dragProps: { dragKey: NodeId }, monitor: DropTargetMonitor<NodeId, void>) => 
		{
			const offset = monitor.getDifferenceFromInitialOffset();
			if (dragProps && offset)
				moveNodeByOffset({ nodeId: dragProps.dragKey, offset });
		},
		[moveNodeByOffset],
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
			{nodes.map(node => <Draggable key={node.id} dragKey={node.id} position={node.position}>
				<NodeCard key={node.id} nodeId={node.id} />
			</Draggable>)}

			<Connector source={[18*16, 4*16]} target={[22*16, 8*16]} value={60} tooltip="Copper 60 p/m" />
			<Connector source={[38*16, 8*16]} target={[22*16, 16*16]} value={60} tooltip="Copper 60 p/m" />
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