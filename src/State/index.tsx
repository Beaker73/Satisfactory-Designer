import type { Project } from "@/Model/Project";
import type { Dispatch } from "react";
import { createContext, useContext, useEffect, useReducer } from "react";
import type { ProjectAction } from "./Actions";
import { emptyState, loadProject } from "./Actions/LoadProject";
import type { ProjectState } from "./Model";
import { projectReducer } from "./Reducer";

/**
 * Setup up state and reducer for the active project
 * @param project The project to use
 */
export function useProjectReducer(project?: Project) 
{
	console.debug("useProjectReducer", { project });
	const [state, dispatch] = useReducer(projectReducer, undefined, () => emptyState());
	console.debug("useProjectReducer result", { state, dispatch });

	const projectId = project?.id;

	useEffect(
		() => 
		{
			if(projectId) 
			{
				// get and deserialize data for project
				const json = localStorage.getItem(projectId);
				dispatch(loadProject(projectId, json ?? undefined));
			}
		},
		[projectId],
	);

	return [state, dispatch] as const;
}


export const projectContext = createContext({
	state: emptyState(),
	dispatch: (action: ProjectAction) => { console.error("Missing project provider context. dispatched called", action); },
});

export interface ProjectProviderProps {
	state: ProjectState,
	dispatch: Dispatch<ProjectAction>,
}

/**
 * Gets access to the current project context
 * @returns The current project context containing state and dispatcher
 */
export function useProjectState()
{
	return useContext(projectContext);
}