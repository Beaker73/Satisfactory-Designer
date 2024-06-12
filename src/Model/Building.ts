import { objectFromEntries } from "@/Helpers/Object";
import type { ResourceKey } from "i18next";
import type { Key, KeyedRecord } from "./Identifiers";
import type { RecipeKey } from "./Recipe";

/** Key to uniquely identify a building */
export type BuildingKey = Key<"Building">;
/** Key to uniquely identify a category of buildings */
export type BuildingCategoryKey = Key<"BuildingCategory">;

export const knownBuildingCategories = objectFromEntries(
	(["resource", "extraction", "factory", "transport"] as const)
		.map(cat => [cat, cat as BuildingCategoryKey]),
);

/** Record with buildings index by their key */
export type Buildings = KeyedRecord<BuildingKey, Building>;

// optional category to restrict type of building
export interface Building {
	/** The unique key of the building */
	key: BuildingKey,
	/** The key of the resource with the name of the building */
	nameKey: ResourceKey,
	/** The key of the resource with the description of the building */
	descriptionKey: ResourceKey,
	/** The category the building belongs to */
	category: BuildingCategoryKey,
	/** The URL of the generic image, if one exists */
	imageUrl?: string,
	/** The URL to the generic wiki, if one exists */
	wikiUrl?: string,
	/** The keys of the recipes that can be selected for the building */
	allowedRecipes?: RecipeKey[],
	/** If receipes are allowed this holds the default recipe */
	defaultRecipe?: RecipeKey,
	/** The available variants of the building. If there are variants, the base building cannot be build */
	variants?: BuildingVariants;
	/** The default variant if theref are variants. */
	defaultVariant?: BuildingVariantKey,
	/** The maximum number of items/m3 per minute for transport buildings */
	maxPerMinute?: number,
}

/** Key to uniquely identify a building variant */
export type BuildingVariantKey = Key<"BuildingVariant">;

export type BuildingVariants = KeyedRecord<BuildingVariantKey, BuildingVariant>;

export interface BuildingVariant {
	/** The unique key of the building variant */
	key: BuildingVariantKey,
	/** The key of the resource with the name of the building variant */
	nameKey: ResourceKey,
	/** The key of the resource with the description of the building variant */
	descriptionKey: ResourceKey,
	/** The category the building variant belongs to */
	category: BuildingCategoryKey,
	/** The URL of the image */
	imageUrl?: string,
	/** The URL to the wiki */
	wikiUrl?: string,
	/** The keys of the recipes that can be selected for the building variant */
	allowedRecipes?: RecipeKey[],
	/** If receipes are allowed this holds the default recipe */
	defaultRecipe?: RecipeKey,
	/** The maximum number of items/m3 per minute for transport buildings */
	maxPerMinute?: number,
}
