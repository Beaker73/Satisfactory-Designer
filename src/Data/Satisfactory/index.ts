import type { ResourceKey } from "../Languages/Model";

export interface BuildingData {
	/** The number of slots for slugs this building has */
	slugSlots?: number,
	/** If the building outputs something by default (resource nodes), this is what it is outputing */
	output?: BuildingOutput | BuildingOutput[],
	/** The number of input slots the building has */
	inputSlots?: number,
	/** The number of output slots the building has (excluding the hardcoded slots from resource nodes) */
	outputSlots?: number,
}

export interface Building extends BuildingData {
	/** The Key of the display name of this building */
	displayName: ResourceKey,
	/** The variants of this building, if any */
	variants?: Record<string, BuildingVariant>,
}

export interface BuildingVariant extends Partial<BuildingData>
{
	/** The Key of the display name of this variant of the building */
	displayName: ResourceKey,
}

/** The output this variant of the building gives */
export interface BuildingOutput {
	/** The key of the item outputted */
	item: string,
	/** Default number of items per minute. Might be modified by buildings, like miners (mk2, mk3) */
	perMinute: number,
}

export interface Item {
	/** The key of the item */
	key: string,
	/** The category of the item */
	category: ItemCategory,
	/** The key of the resource for the display name */
	displayName: ResourceKey,
	/** The key of the resource for the description */
	description?: ResourceKey,
	/** The maximum number of this item in a stack */
	stackSize: number,
	/** The number of points for sinking the item */
	sinkPoints?: number,
}

/** Type of item */
export const enum ItemCategory {
	/** Resource item (like iron, copper etc.) */
	Resource = "resource",
}