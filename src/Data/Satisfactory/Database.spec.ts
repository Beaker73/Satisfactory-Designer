import { describe, expect, test, vi } from "vitest";
import data from "../../../public/Database.json";
import { loadDatabase } from "./Database";

describe("satisfactory database", () => 
{
	const fetch = vi.fn();
	global.fetch = fetch;
	
	function createFetchResponse<T>(data: T)
	{
		return { json: () => new Promise<T>(resolve => resolve(data)) };
	}


	test("ensure correct data import", () => 
	{
		expect("items" in data).toBeTruthy();
		expect("ironOre" in data.items).toBeTruthy();
	});

	// mock data as a response
	fetch.mockResolvedValue(createFetchResponse(data));

	test("load a basic item", async () => 
	{
		const subject = await loadDatabase();
		const ironOre = subject.items.getByKey("ironOre");

		expect(ironOre).toEqual({
			"key": "ironOre", // should be taken from key in record
			"category": "resource",
			"displayName": "item.ironOre.name", // should not be in database, but inferred
			"description": "item.ironOre.description", // should not be in database, but inferred
			"sinkPoints": 1,
			"stackSize": 100,
			"wikiPage": "Iron_Ore",
			"variants": "purity",
		});
	});

	test("load a basic building", async () =>
	{
		const subject = await loadDatabase();
		const ironNode = subject.buildings.getByKey("resourceNodeIronOre");

		expect(ironNode).toEqual({
			"key": "resourceNodeIronOre",
			"displayName": "building.resourceNodeIronOre.name",
			"description": "building.resourceNodeIronOre.description",
			"outputs": 1,
			variants: {
				"impure": {
					"key": "impure",
					"outputs": 1,
					"displayName": "building.resourceNodeIronOre.impure.name",
					"description": "building.resourceNodeIronOre.impure.description",
					"allowedRecipes": ["resourceNodeIronImpure"],
				},
				"normal": {
					"key": "normal",
					"outputs": 1,
					"displayName": "building.resourceNodeIronOre.normal.name",
					"description": "building.resourceNodeIronOre.normal.description",
					"allowedRecipes": ["resourceNodeIronNormal"],
				},
				"pure": {
					"key": "pure",
					"outputs": 1,
					"displayName": "building.resourceNodeIronOre.pure.name",
					"description": "building.resourceNodeIronOre.pure.description",
					"allowedRecipes": ["resourceNodeIronPure"],
				},
			},
		});
	});
});