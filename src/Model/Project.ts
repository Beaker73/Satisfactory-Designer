import type { Guid } from "./Guid";

/** Project information */
export interface Project {

	/** The id of the project */
	id: Guid,

	/** The name of the project */
	name: string,

	/** Date and time of the last modification */
	lastModifiedOn: Date,
}