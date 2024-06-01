import type { NodeId } from "@/Model/Node";
import type { XYCoord } from "react-dnd";
import type { Action } from ".";
import type { ProjectState } from "../Model";

export type MoveNodeByOffsetAction = Action<"moveNodeByOffset", MoveNodeByOffsetPayload>;

export interface MoveNodeByOffsetPayload {
	nodeId: NodeId,
	offset: XYCoord,
}

export function moveNodeByOffset(nodeId: NodeId, offset: XYCoord): MoveNodeByOffsetAction
{
	return {
		type: "moveNodeByOffset",
		payload: {
			nodeId,
			offset,
		},
	};
}

export function applyMoveNodeByOffset(state: ProjectState, payload: MoveNodeByOffsetPayload)
{
	const { nodeId, offset } = payload;

	const node = state.nodes[nodeId];
	if(node) 
	{
		node.position[0] += Math.round(offset.x / 16) * 16;
		node.position[1] += Math.round(offset.y / 16) * 16;
	}
}