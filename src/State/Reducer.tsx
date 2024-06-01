import { assertNever } from "@/Helpers";
import { store } from "@/Store";
import { produce } from "immer";
import type { ProjectAction } from "./Actions";
import { applyAddNode } from "./Actions/AddNode";
import { applyDeleteNode } from "./Actions/DeleteNode";
import { applyLoadProject } from "./Actions/LoadProject";
import { applyMoveNodeByOffset } from "./Actions/MoveNodeByOffset";
import { applySetNodeRecipe } from "./Actions/SetNodeRecipe";
import { applySetNodeVariant } from "./Actions/SetNodeVariant";
import type { ProjectState } from "./Model";

export function projectReducer(state: ProjectState, action: ProjectAction) 
{
	console.debug("reducer", { action });

	const newState = produce(state, (draft: ProjectState) => 
	{
		switch (action.type) 
		{

			case "loadProject":
				return applyLoadProject(draft, action.payload);
				break;

			case "addNode":
				applyAddNode(draft, action.payload);
				break;

			case "moveNodeByOffset":
				applyMoveNodeByOffset(draft, action.payload);
				break;

			case "setNodeRecipe":
				applySetNodeRecipe(draft, action.payload);
				break;

			case "setNodeVariant":
				applySetNodeVariant(draft, action.payload);
				break;

			case "deletNode":
				applyDeleteNode(draft, action.payload);
				break;

			default:
				assertNever(action);

		}
	});

	if (import.meta.env.DEV)
		console.debug("reducer", { oldState: JSON.parse(JSON.stringify(state)), newState: JSON.parse(JSON.stringify(newState)), action });

	if(newState.projectId) 
	{
		const json = JSON.stringify(newState);
		console.debug("set local storage", { id: newState.projectId, json });
		localStorage.setItem(newState.projectId, json);

		const actions = store.getActions();
		actions.projects.touch({ projectId: newState.projectId });
	}
	
	return newState;
}