import type { BuildingKey, BuildingVariantKey } from "./Building";
import type { Guid } from "./Identifiers";
import type { Position } from "./Position";
import type { RecipeKey } from "./Recipe";

export type NodeId = Guid<"Node">;

export interface Node {
	id: NodeId,
	position: Position,
	buildingKey: BuildingKey,
	variantKey?: BuildingVariantKey,
	recipeKey?: RecipeKey,
}

