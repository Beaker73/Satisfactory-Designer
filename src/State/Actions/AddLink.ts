import { newGuid } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
import type { NodeId } from "@/Model/Node";
import type { Action } from ".";
import type { ProjectState } from "../Model";
import type { Link } from "../Model/Link";

export type AddLinkAction = Action<"addLink", AddLinkPayload>;

export interface AddLinkPayload {
	source: NodeId,
	target: NodeId,
	itemKey: ItemKey,
	itemsPerMinute: number,
	tag?: string,
}

export function addLink(source: NodeId, target: NodeId, itemKey: ItemKey, itemsPerMinute: number, tag?: string): AddLinkAction 
{
	return {
		type:"addLink",
		payload: {
			source,
			target,
			itemKey,
			itemsPerMinute,
			tag,
		},
	};
}

export function applyAddLink(state: ProjectState, payload: AddLinkPayload) 
{
	const { source, target, itemKey, itemsPerMinute, tag } = payload;

	const link: Link = {
		id: newGuid(),
		source,
		target,
		itemKey,
		itemsPerMinute,
		tag,
	};

	state.links[link.id] = link;

	addLink(link.source);
	addLink(link.target);

	function addLink(nodeId: NodeId)
	{
		let list = state.linksUsedByNode[nodeId];
		if(!list) 
		{
			list = [];
			state.linksUsedByNode[nodeId] = list;
		}
		if(list.indexOf(link.id) == -1)
			list.push(link.id);
	}
}

