import type { Node, NodeId } from "@/Model/Node";
import type { ProjectId } from "@/Model/Project";
import type { Link, LinkId } from "./Link";

/** The state of the project begin editted */
export interface ProjectState
{
	/** The id of the project */
	projectId?: ProjectId,
	
	/** The nodes in the project by id */
	nodes: Record<NodeId, Node>,
	/** The links in the project by id */
	links: Record<LinkId, Link>,
	/** Maps the nodes to links */
	linksUsedByNode: Record<NodeId, LinkId[]>,
}
