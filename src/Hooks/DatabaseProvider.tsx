import { deepFreeze } from "@/Helpers/Deep";
import type { Building, BuildingCategoryKey, BuildingKey } from "@/Model/Building";
import type { Item, ItemCategoryKey, ItemKey } from "@/Model/Item";
import type { Recipe, RecipeKey } from "@/Model/Recipe";
import type { Database as DatabaseData, LanguageInfo, LanguageKey } from "@/Plugins";
import { groupBy } from "lodash";
import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

const databaseContext = createContext<DatabaseData | undefined>(undefined);

export interface DatabaseProviderProps
{
	database: DatabaseData,
}

export function DatabaseProvider(props: PropsWithChildren<DatabaseProviderProps>) 
{
	const { database } = props;

	return <databaseContext.Provider value={database}>
		{props.children};
	</databaseContext.Provider>;
}

export interface Database 
{
	languages: {
		/** Get all languages */
		getAll(): Record<LanguageKey, LanguageInfo>,
	},
	recipes: {
		/**
		 * Get recipe by its key
		 * @param recipeKey The key of the item to get
		 * @returns The item with the requested key; undefined when not found
		 */
		getByKey(recipeKey: RecipeKey): Recipe | undefined,
		/**
		 * Get all recipes with the requested item as part of the input
		 * @param itemKey The kye of the item that should be part of the input of the recipe
		 * @returns An array of all recipes that have the requested item as input
		 */
		getWithInput(itemKey: ItemKey): Recipe[],
		/**
		 * Get all recipes with the requested item as part of the output
		 * @param itemKey The key of the item that should be part of the output in the recipe
		 * @returns An array of all recipes that have the requested item as output
		 */
		getWithOutput(itemKey: ItemKey): Recipe[],
	},
	items: {
		/**
		 * Get all items of the requested category
		 * @param category The category of the items to get
		 * @returns An array of all items with the requested category
		 */
		getByCategory(category: ItemCategoryKey): Item[],
		/**
		 * Get item by its key
		 * @param itemKey The key of the item to get
		 * @returns The item with the requested key; undefined when not found
		 */
		getByKey(itemKey: ItemKey): Item | undefined,
	},
	buildings: {
		/**
		 * Get all buildings of the requested category
		 * @param category The category of the buildings to get
		 * @returns An array of all buildings with the requested category
		 */
		getByCategory(category: BuildingCategoryKey): Building[],
		/**
		 * Get building by its key
		 * @param buildingKey The key of the building to get
		 * @returns The building with the request key; undefined when not found
		 */
		getByKey(buildingKey: BuildingKey): Building | undefined,
	}
}

/**
 * Returns the Satisfactory Database
 * @returns The Satisfactory Database
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useDatabase(): Database
{
	const data = useContext(databaseContext);
	if(!data)
		throw new Error("No database context");

	const database = useMemo<Database>(() => 
	{
		// const recipesByInputItem = groupBy(data.recipes, r => r.inputs)
		const itemsByCategory = deepFreeze(groupBy(data.items, i => i.category));
		const buildingsByCategory = deepFreeze(groupBy(data.buildings, b => b.category));

		return {
			languages: {
				getAll: () => data.languages,
			},
			recipes: {
				getByKey: recipeKey => data.recipes[recipeKey],
				getWithInput: _itemKey => { throw new Error("not implemented"); },
				getWithOutput: _itemKey => { throw new Error("not implemented"); },
			},
			items: {
				getByCategory: category => itemsByCategory[category],
				getByKey: itemKey => data.items[itemKey],
			},
			buildings: {
				getByCategory: category => buildingsByCategory[category],
				getByKey: buildingKey => data.buildings[buildingKey],
			},
		};
	}, [data]);
	
	return database;
}