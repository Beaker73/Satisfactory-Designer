import type { NodeId } from "@/Model/Node";
import type { Action } from ".";
import type { ProjectState } from "../Model";

export type DeleteNodeAction = Action<"deletNode", DeleteNodePayload>;

export interface DeleteNodePayload {
	nodeId: NodeId;
}

export function deleteNode(nodeId: NodeId) : DeleteNodeAction
{
	return {
		type: "deletNode",
		payload: {
			nodeId,
		},
	};
}

export function applyDeleteNode(state: ProjectState, payload: DeleteNodePayload) 
{
	const { nodeId } = payload;
	delete state.nodes[nodeId];
}