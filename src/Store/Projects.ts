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
	/** The next unnamed project number */
	unnamedProjectNumber: number,

	/** Gets a list of all the projects */
	allProjects: Computed<ProjectsModel, Project[]>,
	/** If the store contains no projects */
	hasNoProjects: Computed<ProjectsModel, boolean>,
	/** Gets the active project */
	activeProject: Computed<ProjectsModel, Project>,
	/** Gets the project with the provided id */
	getProjectById: Computed<ProjectsModel, (projectId: Guid) => Project | undefined>,

	/** merge a list of projects into the store */
	mergeProjects: Action<ProjectsModel, { projects: Project[] }>,
	/** Set the id of the current active project */
	setActiveProject: Action<ProjectsModel, Guid>,
	incrementNextProjectNumber: Action<ProjectsModel, void>,
	/** Change the name of a project */
	changeProjectName: Action<ProjectsModel, { projectId: Guid, newName: string }>,
	/** remove the project with the provided id */
	removeProject: Action<ProjectsModel, { projectId: Guid }>,

	/** Create a default project */
	ensureDefault: Thunk<ProjectsModel, void, void, StoreModel, void>,
	/** Creats a new project */
	newProject: Thunk<ProjectsModel, void, void, StoreModel, Promise<void>>,
	/** Load the provided project */
	loadProject: Thunk<ProjectsModel, { project: Project }, void, StoreModel, Promise<void>>,
	/** Delete the project with the provided id */
	deleteProject: Thunk<ProjectsModel, { projectId: Guid }, void, StoreModel, Promise<void>>,
}

export const projectsImpl: ProjectsModel = {
	projects: {},
	activeProjectId: newGuid(),
	unnamedProjectNumber: 1,

	allProjects: computed(state => Object.values(state.projects) ?? []),
	hasNoProjects: computed(state => Object.keys(state.projects).length === 0),
	activeProject: computed(state => state.projects[state.activeProjectId]),
	getProjectById: computed(state => id => state.projects[id]),

	mergeProjects: action((state, { projects }) => 
	{
		for (const project of projects)
			state.projects[project.id] = project;
	}),
	setActiveProject: action((state, id) => { state.activeProjectId = id; }),
	incrementNextProjectNumber: action(state => { state.unnamedProjectNumber += 1; }),
	changeProjectName: action((state, { projectId, newName }) => 
	{
		const project = state.projects[projectId];
		if (project)
			project.name = newName;
	}),
	removeProject: action((state, { projectId }) => 
	{
		delete state.projects[projectId];
	}),

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

	newProject: thunk(async ({ mergeProjects, setActiveProject, incrementNextProjectNumber }, _, { getState }) => 
	{
		const id = newGuid();
		const state = getState();

		const project: Project = {
			id,
			name: `Unnamed Project ${state.unnamedProjectNumber}`,
			lastModifiedOn: new Date(),
		};

		mergeProjects({ projects: [project] });
		setActiveProject(id);
		incrementNextProjectNumber();
	}),

	loadProject: thunk(async ({ setActiveProject }, { project }) => 
	{
		setActiveProject(project.id);
	}),
	deleteProject: thunk(async ({ removeProject }, { projectId }, { getState }) => 
	{
		if(projectId !== getState().activeProjectId)
			removeProject({ projectId });
	}),
};