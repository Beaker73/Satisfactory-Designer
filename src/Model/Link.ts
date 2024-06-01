import type { Guid } from "./Identifiers";
import type { ItemKey } from "./Item";
import type { NodeId } from "./Node";


export type LinkId = Guid<"Link">;

export interface Link {
	/** The id of this link */
	id: LinkId;
	/** The source node (output port) */
	source: NodeId;
	/** The target node (input port) */
	target: NodeId;
	/** The type of item on the link */
	itemKey: ItemKey;
	/** The number of items per minute on the link */
	itemsPerMinute: number;
	/** Optional tag of the items on the link */
	tag?: string;
}

