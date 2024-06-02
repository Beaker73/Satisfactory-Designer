import type { Node, NodeId } from "./Node";
import type { Ingredient, Recipe } from "./Recipe";

export type DragType = "node" |  "port";

export type DragNodeData = { type: "node", dragKey: NodeId };
export type DragPortData = { type: "port", node: Node, recipe: Recipe, ingredient: Ingredient, side: "left" | "right", };

export type DragData =
	| DragNodeData
	| DragPortData
	;