import type { BuildingVariantKey } from "@/Model/Building";
import type { NodeId } from "@/Model/Node";
import type { Action } from ".";
import type { ProjectState } from "../Model";

export type SetNodeVariantAction = Action<"setNodeVariant", SetNodeVariantPayload>;

export interface SetNodeVariantPayload
{
	nodeId: NodeId,
	variantKey: BuildingVariantKey,	
}

export function setNodeVariant(nodeId: NodeId, variantKey: BuildingVariantKey): SetNodeVariantAction
{
	return {
		type: "setNodeVariant",
		payload: {
			nodeId,
			variantKey,
		},
	};
}

export function applySetNodeVariant(state: ProjectState, payload: SetNodeVariantPayload) 
{
	const { nodeId, variantKey } = payload;

	const node = state.nodes[nodeId];
	if(node) 
		node.variantKey = variantKey;
}