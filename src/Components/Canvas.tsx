import { makeStyles, tokens } from "@fluentui/react-components";
import { useCallback, useRef, useState } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";

import { useProject } from "@/ComputeModel/ProjectContext";
import type { DragData } from "@/Model/DragData";
import type { Position } from "@/Model/Position";
import { observer } from "mobx-react-lite";
import { Connector } from "./Connector";
import { Draggable } from "./Draggable";
import { NodeCard } from "./NodeCard";

export const Canvas = observer(() =>
{
	const project = useProject();
	const styles = useStyles();

	const [dragConnector, setDragConnector] = useState<{ source: Position, target: Position } | undefined>();

	const onNodeDropped = useCallback(
		(dragProps: DragData, monitor: DropTargetMonitor<DragData, void>) => 
		{
			if(dragProps && dragProps.type === "port")
				setDragConnector(undefined);

			console.debug("drop", { dragProps, monitor });
			if (dragProps && dragProps.type === "node") 
			{
				const offset = monitor.getDifferenceFromInitialOffset();
				if(offset) 
				{
					const node = project?.nodes.find(n => n.id === dragProps.dragKey);
					if(node)
						node.moveTo([offset.x, offset.y]); 
				} 
			}
		},
		[project],
	);

	const canvasElement = useRef<HTMLDivElement | null>(null);
	const onItemHover = useCallback(
		(item: DragData, monitor: DropTargetMonitor) => 
		{
			console.debug("hover", { item, monitor });

			if (item.type === "port") 
			{
				const rect = canvasElement.current?.getBoundingClientRect();
				const source = monitor.getInitialClientOffset();
				const target = monitor.getClientOffset();
				if (source && target && rect) 
				{
					let s: Position = [
						Math.round((source.x - rect.left) / 16) * 16,
						Math.round((source.y - rect.top) / 16) * 16,
					];
					let t: Position = [
						target.x - rect.left,
						target.y - rect.top,
					];

					if (item.side === "left")
						[s, t] = [t, s];

					setDragConnector({ source: s, target: t });

				}
			}
		},
		[],
	);

	const [, drop] = useDrop<DragData>({
		accept: ["node", "port"],
		hover: onItemHover,
		drop: onNodeDropped,
	});

	//const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
	//const VariantIcon = bundleIcon(AppsListDetailFilled, AppsListDetailRegular);
	//const RecipeIcon = bundleIcon(BookTemplateFilled, BookTemplateRegular);

	return <div className={styles.root} ref={drop}>
		<div className={styles.canvas} ref={canvasElement}>
			{project && project.nodes.map(node => <Draggable key={node.id} dragKey={node.id} position={node.position}>
				<NodeCard key={node.id} node={node} />
			</Draggable>)}
			{project && project.links.map(link => 
			{
				console.debug("link", link);
				let source = link.source.node.position;
				let target = link.target.node.position;

				source = [source[0] + 256, source[1] + 32];
				target = [target[0], target[1] + 32];

				return <Connector key={link.id} source={source} target={target} value={link.itemsPerMinute} />;
			})}

			{/* <Connector source={[18*16, 4*16]} target={[22*16, 8*16]} value={60} tooltip="Copper 60 p/m" />
			<Connector source={[38*16, 8*16]} target={[22*16, 16*16]} value={60} tooltip="Copper 60 p/m" /> */}
		</div>

		{dragConnector && <Connector source={dragConnector.source} target={dragConnector.target} />}
	</div>;
});


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