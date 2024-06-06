import { produce } from "immer";

import { assertNever } from "@/Helpers";
import type { DatabaseAccessor } from "@/Hooks/DatabaseProvider";
import { store } from "@/Store";

import type { ProjectAction } from "./Actions";
import { applyAddLink } from "./Actions/AddLink";
import { applyAddNode } from "./Actions/AddNode";
import { applyDeleteNode } from "./Actions/DeleteNode";
import { applyLoadProject } from "./Actions/LoadProject";
import { applyMoveNodeByOffset } from "./Actions/MoveNodeByOffset";
import { applySetNodeRecipe } from "./Actions/SetNodeRecipe";
import { applySetNodeVariant } from "./Actions/SetNodeVariant";
import type { ProjectState } from "./Model";

export const bindProjectReducer = (database: DatabaseAccessor) => (state: ProjectState, action: ProjectAction) => projectReducer(state, action, database);

export function projectReducer(state: ProjectState, action: ProjectAction, database: DatabaseAccessor) 
{
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

			case "addLink":
				applyAddLink(database, draft, action.payload);
				break;

			case "deletNode":
				applyDeleteNode(draft, action.payload);
				break;

			default:
				assertNever(action);

		}
	});

	if(newState.projectId) 
	{
		const json = JSON.stringify(newState);
		localStorage.setItem(newState.projectId, json);

		const actions = store.getActions();
		actions.projects.touch({ projectId: newState.projectId });
	}
	
	return newState;
}