import { databaseAccessor, setDefaultDatabase } from "@/Hooks/DatabaseContext";
import type { BuildingKey, BuildingVariantKey } from "@/Model/Building";
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
	const minerMk3 = miner.variants!["mk3" as BuildingVariantKey]!;
	const ironMining = database.recipes.getByKey("ironMining" as RecipeKey)!;

	const smelter = database.buildings.getByKey("smelter" as BuildingKey)!;
	const ironIngot = database.recipes.getByKey("ironIngot" as RecipeKey)!;

	const belt = database.buildings.getByKey("belt" as BuildingKey)!;
	const beltMk3 = belt.variants!["mk3" as BuildingVariantKey]!;

	test.skip("switch to valid recipe", () => 
	{
		const node = Node.createForBuilding(smelter);
		node.switchRecipe(ironIngot);
		expect(node.recipe?.key).toBe(ironIngot.key);
	});

	test.skip("switch to invalid recipe", () => 
	{
		const node = Node.createForBuilding(smelter);
		const action = () => node.switchRecipe(ironMining);
		expect(action).toThrowError();
	});

	test.skip("link nodes", () => 
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
		const sourceOutput = source.outputPorts[0];

		const target = Node.createForBuilding(miner);
		const targetInput = target.inputPorts[0]!;
		console.log(target.recipe);
		
		const link = sourceOutput.linkTo(target)!;
		link.switchVariant(beltMk3);

		expect(sourceOutput.outputedPerMinute).toBe(120); // pure outputs 120

		expect(link.source.item).toBe("ironOre");
		expect(link.maxTransportedPerMinute).toBe(270); // max of belt mk3
		expect(link.maxProvidedPerMinute).toBe(120); // max is same as pure node
		expect(link.transportedPerMinute).toBe(60); // actual transport should be what smelter can accept

		expect(targetInput.takenPerMinute).toBe(60); // what smelter can take

		target.switchVariant(minerMk3);
		expect(targetInput.maxTakenPerMinute).toBe(120);
	});
});