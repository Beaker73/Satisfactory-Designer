import type { ResourceKey } from "../Languages/Model";

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
	/** The url to the wiki page */
	wikiUrl?: string,
	/** The key of the variant, if item allows multiple variants */
	variants?: string,
}

export interface VariantSet {
	/** The key of this variant set */
	key: string,
	/** The key of the resource for the title of this variant */
	displayName: ResourceKey,
	/** The key of the default variant */
	default: string,
	/** Type variant types that are available */
	types: Variant[],
}

export interface Variant {
	/** The key of the variant */
	key: string,
	/** The key of the resource for the display name of this variant */
	displayName: ResourceKey,
}

/** Type of item */
export const enum ItemCategory {
	/** Resource item (like iron, copper etc.) */
	Resource = "resource",
}

export interface Building {
	/** The key of the building */
	key: string,
	/** The key to the displayname of the building */
	displayName: string,
	/** The key to the descriptoin of the building */
	description: string,
	/** The size of the building */
	size?: [width: number, length: number, height: number],
	/** The number of inputs the building has */
	inputs?: number,
	/** The number of outputs the building has */
	outputs?: number,
	/** Variants of the building, if any */
	variants?: Record<string, Omit<Building, "variants">>,
	/** Keys of the allowed recipes, if multiple, first is default */
	allowedRecipes?: string[],
	/** The ingredients by key, with their numbers */
	ingredients?: Record<string, number>,
	/** If the building uses power, the amount in watts */
	powerUsage?: number,
}