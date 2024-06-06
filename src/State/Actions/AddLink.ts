import type { DatabaseAccessor } from "@/Hooks/DatabaseProvider";
import { newGuid } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
import type { NodeId } from "@/Model/Node";

import type { ProjectState } from "../Model";
import type { Link } from "../Model/Link";

import type { Action } from ".";


export type AddLinkAction = Action<"addLink", AddLinkPayload>;

export interface AddLinkPayload {
	source: NodeId,
	target: NodeId,
	itemKey: ItemKey,
}

export function addLink(source: NodeId, target: NodeId, itemKey: ItemKey): AddLinkAction 
{
	return {
		type:"addLink",
		payload: {
			source,
			target,
			itemKey,
		},
	};
}

export function applyAddLink(database: DatabaseAccessor, state: ProjectState, payload: AddLinkPayload) 
{
	const { source, target, itemKey } = payload;

	const sourceNode = state.nodes[source];

	if(!sourceNode.recipeKey)
		throw new Error("No recipe configured on source node");
	const recipe = database.recipes.getByKey(sourceNode.recipeKey);
	if(!recipe)
		throw new Error(`Failed to find recipe for key ${sourceNode.recipeKey}`);

	const ingredient = recipe.outputs?.[itemKey];
	if(!ingredient)
		throw new Error(`Failed to find ingredient for ${itemKey}`);

	const itemsPerMinute = 60 / recipe.duration * ingredient.count;

	const link: Link = {
		id: newGuid(),
		source,
		target,
		itemKey,
		itemsPerMinute,
		tag: ingredient.tag,
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

