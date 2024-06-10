import { databaseAccessor, setDefaultDatabase } from "@/Hooks/DatabaseContext";
import type { BuildingKey } from "@/Model/Building";
import { newGuid } from "@/Model/Identifiers";
import type { RecipeKey } from "@/Model/Recipe";
import { loadPlugins } from "@/Plugins";
import { describe, expect, test } from "vitest";
import { Link } from "./Link";
import { Node } from "./Node";

describe("faafsd", async () => 
{
	const data = await loadPlugins();
	const database = databaseAccessor(data);
	setDefaultDatabase(database);

	const miner = database.buildings.getByKey("miner" as BuildingKey)!;
	const ironMining = database.recipes.getByKey("ironMining" as RecipeKey)!;

	const smelter = database.buildings.getByKey("smelter" as BuildingKey)!;
	const ironIngot = database.recipes.getByKey("ironIngot" as RecipeKey)!;

	test("run", () => 
	{
		const source = new Node(newGuid(), miner, ironMining);
		const target = new Node(newGuid(), smelter, ironIngot);

		const sourcePort = source.outputPorts[0];
		const targetPort = target.inputPorts[0];

		const link = new Link(newGuid(), sourcePort, targetPort);

		expect(link.itemsPerMinute).toBe(30);
	});
});