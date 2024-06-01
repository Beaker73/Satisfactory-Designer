import type { Guid } from "@/Model/Identifiers";
import type { Node, NodeId } from "@/Model/Node";
import type { ProjectId } from "@/Model/Project";

/** The state of the project begin editted */
export interface ProjectState
{
	// render id
	id: Guid,

	/** The id of the project */
	projectId?: ProjectId,
	
	/** The nodes in the project by id */
	nodes: Record<NodeId, Node>,
}
