import type { Node, NodeId } from "@/ComputeModel/Node";
import type { Port } from "@/ComputeModel/Port";
import type { Recipe } from "./Recipe";

export type DragType = "node" |  "port";

export type DragNodeData = { type: "node", dragKey: NodeId };
export type DragPortData = { type: "port", port: Port, node: Node, recipe: Recipe, side: "left" | "right", };

export type DragData =
	| DragNodeData
	| DragPortData
	;