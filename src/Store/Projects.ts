import { newGuid, type Guid } from "@/Model/Guid";
import type { Project } from "@/Model/Project";
import type { Action, Computed } from "easy-peasy";
import { action, computed } from "easy-peasy";


export interface ProjectsModel {
	/** Set of Projects */
	projects: Record<Guid, Project>,
	selectedProject: Guid,

	/** Gets a list of all the projects */
	allProjects: Computed<ProjectsModel, Project[]>,
	/** If the store contains no projects */
	hasNoProjects: Computed<ProjectsModel, boolean>,

	/** Create a default project */
	createDefault: Action<ProjectsModel, void>,
}

export const projectsImpl: ProjectsModel = {
	projects: {},
	selectedProject: newGuid(),

	allProjects: computed(state => Object.values(state.projects) ?? []),
	hasNoProjects: computed(state => Object.keys(state.projects).length === 0),

	createDefault: action(state => 
	{
		const project: Project = {
			id: newGuid(),
			name: "My first project",
			lastModifiedOn: new Date(),
		};

		state.projects[project.id] = project;
		state.selectedProject = project.id;
	}),
};