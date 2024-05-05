import { groupBy } from "lodash";
import type { Item, ItemCategory, ItemVariant } from ".";

export async function loadDatabase() 
{
	const response = await fetch("Database.json", { method: "GET" });
	const data = await response.json();

	const items = Object
		.entries(data.items)
		.map(([key, item]) => transformItem(key, item));

	const itemsByKey = Object.fromEntries(items.map(item => [item.key, item]));
	const itemsByCategory = groupBy(items, i => i.category);

	const database: Database = {
		items: {
			getByKey: key => itemsByKey[key],
			getByCategory: category => itemsByCategory[category] ?? [],
		},
	};

	console.debug("database", { itemsByKey, itemsByCategory, database });
	return database;
}

function transformItem(key: string, data: any): Item 
{
	const item: Item = {
		...data,
		key,
	};

	if (data.variants) 
	{
		item.variants = {
			...data.variants,
			types: Object.entries<any>(data.variants.types).map(([key, varData]) => 
			{
				return {
					key,
					...varData,
				} as ItemVariant;
			}),
		};
	}

	return item;
}

export interface Database {
	items: {
		getByKey(key: string): Item | undefined;
		getByCategory(category: ItemCategory): Item[];
	}
}