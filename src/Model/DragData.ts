import type { InputPort } from "@/ComputeModel/InputPort";
import type { Node, NodeId } from "@/ComputeModel/Node";
import type { OutputPort } from "@/ComputeModel/OutputPort";
import type { Recipe } from "./Recipe";

export type DragType = "node" |  "port";

export type DragNodeData = { type: "node", dragKey: NodeId };
export type DragPortData = { type: "port", port: InputPort | OutputPort, node: Node, recipe: Recipe, side: "left" | "right", };

export type DragData =
	| DragNodeData
	| DragPortData
	;