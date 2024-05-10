/* eslint-disable @typescript-eslint/no-explicit-any */

import { groupBy } from "lodash";
import type { Item, ItemCategory, Variant, VariantSet } from ".";

export async function loadDatabase() 
{
	const response = await fetch("Database.json", { method: "GET" });
	const data = await response.json();

	const variants = Object
		.entries(data.variants)
		.map(([key, variant]) => transformVariantSet(key, variant));
	const variantsByKey = Object.fromEntries(variants.map(variant => [variant.key, variant]));

	const items = Object
		.entries(data.items)
		.map(([key, item]) => transformItem(key, item));
	const itemsByKey = Object.fromEntries(items.map(item => [item.key, item]));
	const itemsByCategory = groupBy(items, i => i.category);

	const database: Database = {
		variants: {
			getByKey: key => variantsByKey[key],
		},
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

	return item;
}

function transformVariantSet(key: string, data: any): VariantSet 
{
	console.debug("variantSet", data);
	return {
		key,
		...data,
		types: Object.entries<any>(data.types)
			.map(([key, varData]) => 
			{
				return {
					key,
					...varData,
				} as Variant;
			}),
	};
}

export interface Database {
	variants: {
		getByKey(key: string): VariantSet | undefined;
	},
	items: {
		getByKey(key: string): Item | undefined;
		getByCategory(category: ItemCategory): Item[];
	}
}