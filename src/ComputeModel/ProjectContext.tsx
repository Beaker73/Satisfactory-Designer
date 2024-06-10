import { createContext, useContext } from "react";
import type { Project } from "./Project";


export const projectContext = createContext<Project | undefined>(undefined);

export interface ProjectProviderProps
{
	/** The project to provide to the application */
	project?: Project,
}

/** Gets access to the global project that is active */
export function useProject(): Project | undefined
{
	return useContext(projectContext);
}