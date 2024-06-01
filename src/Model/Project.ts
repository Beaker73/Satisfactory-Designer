import type { Guid } from "./Identifiers";

export type ProjectId = Guid<"Project">;

/** Project information */
export interface Project {

	/** The id of the project */
	id: ProjectId,

	/** The name of the project */
	name: string,

	/** Date and time of the last modification */
	lastModifiedOn: Date,
}