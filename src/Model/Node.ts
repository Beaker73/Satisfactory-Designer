import type { Guid } from "./Guid";
import type { Position } from "./Position";

export interface Node {
	id: Guid,
	position: Position,
	itemKey: string,
	variantKey?: string,
}