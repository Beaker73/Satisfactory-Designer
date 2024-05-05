import type { Guid } from "@/Model/Guid";
import type { Node } from "@/Model/Node";
import type { Action } from "easy-peasy";
import { action, computed, type Computed } from "easy-peasy";
import type { XYCoord } from "react-dnd";

export interface NodesModel {
	nodesById: Record<Guid, Node>,

	allNodes: Computed<NodesModel, Node[]>,

	addNode: Action<NodesModel, { node: Node }>,
	moveNodeByOffset: Action<NodesModel, { nodeId: Guid, offset: XYCoord }>,
	setVariant: Action<NodesModel, {nodeId: Guid, variantKey: string }>,
	deleteNode: Action<NodesModel, {nodeId: Guid }>,
}

export const nodesImpl: NodesModel = {
	nodesById: {},

	allNodes: computed(state => Object.values(state.nodesById)),

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
		{
			node.variantKey = variantKey;
		}
	}),
	deleteNode: action((state, { nodeId }) => 
	{
		delete state.nodesById[nodeId];
	}),
};