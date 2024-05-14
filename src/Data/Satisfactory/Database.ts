/* eslint-disable @typescript-eslint/no-explicit-any */

import { groupBy } from "lodash";
import type { Building, Item, ItemCategory, Variant, VariantSet } from ".";

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

	const buildings = Object
		.entries(data.buildings)
		.map(([key, item]) => transformBuilding(key, item));
	const buildingsByKey = Object.fromEntries(buildings.map(building => [building.key, building]));

	const database: Database = {
		variants: {
			getByKey: key => variantsByKey[key],
		},
		items: {
			getByKey: key => itemsByKey[key],
			getByCategory: category => itemsByCategory[category] ?? [],
		},
		buildings: {
			getAll: () => Object.values(buildingsByKey),
			getByKey: key => buildingsByKey[key],
		},
	};

	console.debug("database", { itemsByKey, itemsByCategory, database });
	return database;
}

function transformItem(key: string, data: any): Item 
{
	const item: Item = {
		...data,
		displayName: `item.${key}.name`,
		description: `item.${key}.description`,
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
					displayName: `variant.${key}.name`,
					description: `variant.${key}.description`,
					...varData,
				} as Variant;
			}),
	};
}

function transformBuilding(key: string, data: any): Building 
{
	const building: Building = {
		...data,
		displayName: `building.${key}.name`,
		description: `building.${key}.description`,
		key,
	};

	if("variants" in data) 
	{
		building.variants = Object.fromEntries(
			Object.entries<any>(data.variants)
				.map(([varKey, varData]) => 
				{
					const { variants: _, ...baseBuilding } = building;
					return [
						varKey,
						{
							...baseBuilding,
							...varData,
							displayName: `building.${key}.${varKey}.name`,
							description: `building.${key}.${varKey}.description`,
							key: varKey,
						},
					];
				}),
		);
	}

	return building;
}

export interface Database {
	variants: {
		getByKey(key: string): VariantSet | undefined;
	},
	items: {
		getByKey(key: string): Item | undefined;
		getByCategory(category: ItemCategory): Item[];
	},
	buildings: {
		getAll(): Building[],
		getByKey(key: string): Building | undefined;
	}
}