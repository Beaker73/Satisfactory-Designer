import { newGuid, type Guid } from "@/Model/Guid";
import type { Project } from "@/Model/Project";
import type { Action, Computed, Thunk } from "easy-peasy";
import { action, computed, thunk } from "easy-peasy";
import type { StoreModel } from ".";


export interface ProjectsModel {
	/** Set of Projects */
	projects: Record<Guid, Project>,
	/** The Id of the current active project */
	activeProjectId: Guid,

	/** Gets a list of all the projects */
	allProjects: Computed<ProjectsModel, Project[]>,
	/** If the store contains no projects */
	hasNoProjects: Computed<ProjectsModel, boolean>,
	/** Gets the active project */
	activeProject: Computed<ProjectsModel, Project>,

	/** merge a list of projects into the store */
	mergeProjects: Action<ProjectsModel, { projects: Project[] }>,
	/** Set the id of the current active project */
	setActiveProject: Action<ProjectsModel, Guid>,

	/** Create a default project */
	ensureDefault: Thunk<ProjectsModel, void, void, StoreModel, void>,
}

export const projectsImpl: ProjectsModel = {
	projects: {},
	activeProjectId: newGuid(),

	allProjects: computed(state => Object.values(state.projects) ?? []),
	hasNoProjects: computed(state => Object.keys(state.projects).length === 0),
	activeProject: computed(state => state.projects[state.activeProjectId]),

	mergeProjects: action((state, { projects }) => 
	{
		for (const project of projects)
			state.projects[project.id] = project;
	}),
	setActiveProject: action((state, id) => { state.activeProjectId = id; }),

	ensureDefault: thunk(({ mergeProjects, setActiveProject }, _, { getState }) => 
	{
		const state = getState();
		if (state.hasNoProjects) 
		{

			const project: Project = {
				id: newGuid(),
				name: "My first project",
				lastModifiedOn: new Date(),
			};

			mergeProjects({ projects: [project] });
			setActiveProject(project.id);
		}
	}),
};