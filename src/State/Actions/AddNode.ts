import { type Building } from "@/Model/Building";
import { newGuid } from "@/Model/Identifiers";
import type { Node } from "@/Model/Node";
import type { Action } from ".";
import type { ProjectState } from "../Model";

export type AddNodeAction = Action<"addNode", AddNodePayload>;

export interface AddNodePayload {
	/** The building to add a node for */
	building: Building,
}

export function addNode(building: Building): AddNodeAction
{
	return {
		type: "addNode",
		payload: {
			building,
		},
	};
}

export function applyAddNode(state: ProjectState, payload: AddNodePayload) 
{
	const { building } = payload;

	const node: Node = {
		id: newGuid(),
		buildingKey: building.key,
		recipeKey: building.defaultRecipe,
		variantKey: building.defaultVariant ?? (building.variants ? Object.values(building.variants)[0]?.key : undefined),
		position: [16, Object.values(state.nodes).reduce((m, n) => Math.max(m, n.position[1]), 0) + 16],
	};

	state.nodes[node.id] = node;
}