import type { BuildingVariantKey } from "@/Model/Building";
import type { Node, NodeId } from "@/Model/Node";
import type { RecipeKey } from "@/Model/Recipe";
import type { Action } from "easy-peasy";
import { action, computed, type Computed } from "easy-peasy";
import type { XYCoord } from "react-dnd";

export interface NodesModel {
	nodesById: Record<NodeId, Node>,

	allNodes: Computed<NodesModel, Node[]>,
	getById: Computed<NodesModel, (nodeId: NodeId) => Node>,

	addNode: Action<NodesModel, { node: Node }>,
	moveNodeByOffset: Action<NodesModel, { nodeId: NodeId, offset: XYCoord }>,
	setVariant: Action<NodesModel, {nodeId: NodeId, variantKey: BuildingVariantKey }>,
	setRecipe: Action<NodesModel, {nodeId: NodeId, recipeKey: RecipeKey }>,
	deleteNode: Action<NodesModel, {nodeId: NodeId }>,
}

export const nodesImpl: NodesModel = {
	nodesById: {},

	allNodes: computed(state => Object.values(state.nodesById)),
	getById: computed(state => id => state.nodesById[id]),

	addNode: action((state, { node }) => 
	{
		state.nodesById[node.id] = node;
	}),
	moveNodeByOffset: action((state, { nodeId, offset }) => 
	{
		const node = state.nodesById[nodeId];
		if (node) 
		{
			node.position[0] = Math.round((node.position[0] + offset.x) / 16) * 16;
			node.position[1] = Math.round((node.position[1] + offset.y) / 16) * 16;
		}
	}),
	setVariant: action((state, { nodeId, variantKey }) => 
	{
		const node = state.nodesById[nodeId];
		if(node) 
			node.variantKey = variantKey;
	}),
	setRecipe: action((state, { nodeId, recipeKey }) => 
	{
		const node = state.nodesById[nodeId];
		if(node) 
			node.recipeKey = recipeKey;
	}),
	deleteNode: action((state, { nodeId }) => 
	{
		delete state.nodesById[nodeId];
	}),
};