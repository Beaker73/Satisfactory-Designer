import { newGuid } from "@/Model/Identifiers";
import type { ProjectId } from "@/Model/Project";
import type { Action } from ".";
import type { ProjectState } from "../Model";

/** Action to load a project from a json serialized state */
export type LoadProjectAction = Action<"loadProject", LoadProjectPayload>;

/** The payload for the load project action */
export interface LoadProjectPayload 
{
	projectId: ProjectId,
	json?: string,
}

/**
 * Loads a project from a serialized state
 * @param json The json data to deserialize and use as input for the state
 * @returns The action to dispatch that will load the project data
 */
export function loadProject(projectId: ProjectId, json?: string): LoadProjectAction 
{
	return {
		type: "loadProject",
		payload: {
			projectId,
			json,
		},
	};
}

/**
 * Applies the action/payload by deserializing the json and setting it as the current state
 * @param state The current state of the project
 * @param payload The payload containing the json to deserialize
 */
export function applyLoadProject(state: ProjectState, payload: LoadProjectPayload): ProjectState
{
	const { projectId, json } = payload;

	if(json) 
	{
		const data = JSON.parse(json);
		if(data && "projectId" in data && typeof data.projectId === "string" && data.projectId === projectId)
			return data as ProjectState;
	}

	return {
		id: newGuid(),
		projectId,
		nodes: {},
	} satisfies ProjectState;
}

export function emptyState(): ProjectState
{
	const id = newGuid();
	console.debug("reducer: new emptyState", id);

	return {
		id,
		nodes: {},
	} satisfies ProjectState;
}