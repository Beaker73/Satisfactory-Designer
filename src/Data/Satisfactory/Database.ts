import { groupBy } from "lodash";
import type { Item, ItemCategory } from ".";

export async function loadDatabase() 
{
	const response = await fetch("Database.json", { method: "GET" });
	const data = await response.json();

	const items = Object
		.entries(data.items)
		.map(([key, item]) => ({ key, ...(item as object) } as Item));

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

export interface Database {
	items: {
		getByKey(key: string): Item | undefined;
		getByCategory(category: ItemCategory): Item[];
	}
}