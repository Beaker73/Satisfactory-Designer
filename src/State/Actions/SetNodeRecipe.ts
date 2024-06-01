import type { NodeId } from "@/Model/Node";
import type { RecipeKey } from "@/Model/Recipe";
import type { Action } from ".";
import type { ProjectState } from "../Model";

export type SetNodeRecipeAction = Action<"setNodeRecipe", SetNodeRecipePayload>;

export interface SetNodeRecipePayload
{
	nodeId: NodeId,
	recipeKey: RecipeKey,	
}

export function setNodeRecipe(nodeId: NodeId, recipeKey: RecipeKey): SetNodeRecipeAction
{
	return {
		type: "setNodeRecipe",
		payload: {
			nodeId,
			recipeKey,
		},
	};
}

export function applySetNodeRecipe(state: ProjectState, payload: SetNodeRecipePayload) 
{
	const { nodeId, recipeKey } = payload;

	const node = state.nodes[nodeId];
	if(node) 
		node.recipeKey = recipeKey;
}