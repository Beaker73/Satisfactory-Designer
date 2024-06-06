import type { ResourceKey } from "i18next";
import type { Key, KeyedRecord } from "./Identifiers";

/** Key to uniquely identity an item */
export type ItemKey = Key<"Item">;
/** Key to uniquely identify categories of items */
export type ItemCategoryKey = Key<"ItemCategory">;

/** Record with items index by their key */
export type Items = KeyedRecord<ItemKey, Item>;

/** An item that can be belted/transported and is used to construct other items or buildings */
export interface Item {
	/** The unique key of the item */
	key: ItemKey,
	/** The category this item belongs to */
	category: ItemCategoryKey,
	/** The resource key of the display name */
	nameKey: ResourceKey,
	/** The resource key of the description */
	descriptionKey: ResourceKey,
	/** The URL of the wiki page of the item */
	wikiUrl?: string,
	/** The path the the image */
	imageUrl?: string,
	/** The maximum size of a stack of items */
	stackSize?: number,
	/** The number of points you get for sinking the item */
	sinkPoints?: number,
}
