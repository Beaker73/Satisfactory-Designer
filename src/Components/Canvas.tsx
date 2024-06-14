import { makeStyles, tokens } from "@fluentui/react-components";
import { useCallback, useRef, useState } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";

import { useProject } from "@/ComputeModel/ProjectContext";
import { knownBuildingCategories } from "@/Model/Building";
import type { DragData } from "@/Model/DragData";
import type { Position } from "@/Model/Position";
import { observer } from "mobx-react-lite";
import { Connector } from "./Connector";
import { Draggable } from "./Draggable";
import { LogisticNode } from "./LogisticNode";
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
					{
						node.moveTo({ x: node.position.x + offset.x, y: node.position.y + offset.y }); 
					}
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
					let s: Position = {
						x: Math.round((source.x - rect.left) / 16) * 16,
						y: Math.round((source.y - rect.top) / 16) * 16,
					};
					let t: Position = {
						x: target.x - rect.left,
						y: target.y - rect.top,
					};

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
			{project && project.nodes.map(node => 
			{
				const isLogistics = node.building.category === knownBuildingCategories.logistics;

				return <Draggable key={node.id} dragKey={node.id} position={node.position}>
					{isLogistics && <LogisticNode node={node} />}
					{!isLogistics && <NodeCard node={node} />}
				</Draggable>;
			})}
			{project && project.links.map(link => 
			{
				let source = link.source.parentNode.position;
				let target = link.target.parentNode.position;
				"";
				source = { x: source.x + 256, y: source.y + 32 };
				target = { x: target.x, y: target.y + 32 };

				console.debug("link", link, source, target);

				return <Connector key={link.id} source={source} target={target} value={link.transportedPerMinute} />;
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