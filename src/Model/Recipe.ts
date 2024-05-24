import type { ResourceKey } from "i18next";
import type { Key, KeyedRecord } from "./Identifiers";
import type { ItemKey } from "./Item";

export type RecipeKey = Key<"Recipe">;

/** A record with recipes */
export type Recipes = KeyedRecord<RecipeKey, Recipe>;

export interface Recipe {
	key: RecipeKey,
	nameKey: ResourceKey,
	descriptionKey: ResourceKey,
	duration: number,
	outputs?: KeyedRecord<ItemKey, number>,
	inputs?: KeyedRecord<ItemKey, number>,
}