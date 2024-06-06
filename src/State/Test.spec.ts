import { describe, expect, test } from "vitest";

import { databaseAccessor } from "@/Hooks/DatabaseProvider";
import type { BuildingKey } from "@/Model/Building";
import { newGuid } from "@/Model/Identifiers";
import type { ProjectId } from "@/Model/Project";
import { loadPlugins } from "@/Plugins";

import type { ItemKey } from "@/Model/Item";
import { addLink } from "./Actions/AddLink";
import { addNode } from "./Actions/AddNode";
import { emptyState as buildEmptyState } from "./Actions/LoadProject";
import { bindProjectReducer } from "./Reducer";

describe("", async () => 
{
	const data = await loadPlugins();
	const database = databaseAccessor(data);
	
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const projectReducer = bindProjectReducer(database);

	const smelter = database.buildings.getByKey("smelter" as BuildingKey)!;
	const miner = database.buildings.getByKey("miner" as BuildingKey)!;
	const iron = database.items.getByKey("ironOre" as ItemKey)!;

	const projectId = newGuid<ProjectId>();
	const emptyState = buildEmptyState(projectId);

	test("add node", () => 
	{
		const result = projectReducer(emptyState, addNode(smelter));

		const nodeId = Object.keys(result.nodes)[0];
		expect(result).toEqual({
			projectId: projectId,
			nodes: {
				[nodeId]: {
					id: nodeId,
					position: [16, 16],
					buildingKey: smelter.key,
					recipeKey: smelter.defaultRecipe,
				},
			},
			links: {},
			linksUsedByNode: {},
		});
	});

	test("link nodes", () => 
	{
		let state = projectReducer(emptyState, addNode(miner));
		const minerNode = Object.values(state.nodes).find(n => n.buildingKey == miner.key)!;
		expect(minerNode).not.toBeUndefined();
		
		state = projectReducer(state, addNode(smelter));
		const smelterNode = Object.values(state.nodes).find(n => n.buildingKey == smelter.key)!;
		expect(smelterNode).not.toBeUndefined();
		
		iron;
		state = projectReducer(state, addLink(minerNode.id, smelterNode.id, iron.key));
		const link = Object.values(state.links)[0];
		expect(link).not.toBeUndefined();

		expect(state).toEqual({
			projectId: projectId,
			nodes: {
				[minerNode.id]: {
					id: minerNode.id,
					position: [16, 16],
					buildingKey: miner.key,
					recipeKey: miner.defaultRecipe,
					variantKey: miner.defaultVariant ?? Object.values(miner.variants!)[0]?.key,
				},
				[smelterNode.id]: {
					id: smelterNode.id,
					position: [16, 32],
					buildingKey: smelter.key,
					recipeKey: smelter.defaultRecipe,
				},
			},
			links: {
				[link.id]: {
					id: link.id,
					source: minerNode.id,
					target: smelterNode.id,
					itemKey: iron.key,
					itemsPerMinute: 60,
					tag: undefined,
				},
			},
			linksUsedByNode: {
				[minerNode.id]: [link.id],
				[smelterNode.id]: [link.id],
			},
		});
	});
});