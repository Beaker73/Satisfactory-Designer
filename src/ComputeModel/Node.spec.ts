import { databaseAccessor, setDefaultDatabase } from "@/Hooks/DatabaseContext";
import type { BuildingKey } from "@/Model/Building";
import type { RecipeKey } from "@/Model/Recipe";
import { loadPlugins } from "@/Plugins";
import { describe, expect, test } from "vitest";
import { Node } from "./Node";

describe("Node", async () => 
{
	const data = await loadPlugins();
	const database = databaseAccessor(data);
	setDefaultDatabase(database);

	const ironNode = database.buildings.getByKey("ironNode" as BuildingKey)!;
	const pure = database.recipes.getByKey("ironNodePure" as RecipeKey)!;

	const miner = database.buildings.getByKey("miner" as BuildingKey)!;
	const ironMining = database.recipes.getByKey("ironMining" as RecipeKey)!;

	const smelter = database.buildings.getByKey("smelter" as BuildingKey)!;
	const ironIngot = database.recipes.getByKey("ironIngot" as RecipeKey)!;

	test("switch to valid recipe", () => 
	{
		const node = Node.createForBuilding(smelter);
		node.switchRecipe(ironIngot);
		expect(node.recipe?.key).toBe(ironIngot.key);
	});

	test("switch to invalid recipe", () => 
	{
		const node = Node.createForBuilding(smelter);
		const action = () => node.switchRecipe(ironMining);
		expect(action).toThrowError();
	});

	test("link nodes", () => 
	{
		const source = Node.createForBuilding(ironNode);
		source.switchRecipe(pure);

		const target = Node.createForBuilding(miner);

		const link = source.outputPorts[0].linkTo(target);
		expect(link).not.toBeNull();
	});

	test("link computation", () => 
	{
		const source = Node.createForBuilding(ironNode);
		source.switchRecipe(pure);
		const sourcePort = source.outputPorts[0];

		const target = Node.createForBuilding(miner);
		const targetPort = target.outputPorts[0];
		
		const link = sourcePort.linkTo(target)!;
		expect(link.source).toBe(sourcePort);
		expect(link.target).toBe(targetPort);
		
		// output should provide the items from the source
		expect(link.source.item).toBe("ironOre");
		expect(link.itemsPerMinute).toBe(120);

		// link should provide the items from the output

	});
});