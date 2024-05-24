import type { Guid } from "./Guid";
import type { Position } from "./Position";

export interface Node {
	id: Guid,
	position: Position,
	buildingKey: string,
	recipeKey?: string,
	variantKey?: string,
}