import { knownBuildingCategories } from "@/Model/Building";
import type { Guid } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
import { action, computed, observable } from "mobx";
import type { Link } from "./Link";
import type { Node } from "./Node";

export type InputPortId = Guid<"InputPort">;

/** Input port that accepts incoming items */
export class InputPort 
{
	id: InputPortId;

	/** The parent node for this port */
	@observable accessor parentNode: Node;
	/** The link that links to this port, if linked */
	@observable accessor linkedFrom: Link | undefined;

	/** The item this input port accepts */
	@observable accessor item: ItemKey | undefined;
	/** The item tag */
	@observable accessor tag: string | undefined;
	/** If the port is currently visible */
	@computed get isVisible(): boolean { return (this.parentNode.building.category === knownBuildingCategories.logistics) ? true : !!this.item; }
	/** If the port is connected to a link */
	@computed get isConnected(): boolean { return this.isVisible && !!this.linkedFrom; }
	
	/** Gets if this port has an issue */
	@computed get hasIssue(): boolean 
	{
		if (!this.isConnected)
			return false;
		return this.linkedFrom?.source.item !== this.item;
	}

	/** Creates a new InputPort */
	constructor(id: InputPortId, parentNode: Node) 
	{
		this.id = id;
		this.parentNode = parentNode;
	}

	/** The maximum of items/m3 taken per minute by this building/port */
	@computed get maxTakenPerMinute() 
	{
		if (!this.item)
			return 0;
		const recipe = this.parentNode.recipe;
		if (!recipe || !recipe.inputs)
			return 0;
		const ingredient = recipe.inputs[this.item];
		if (!ingredient)
			return 0;
		return (60 / recipe.duration) * ingredient.count;
	}

	/** The items/m3 taken per minute */
	@computed get takenPerMinute() 
	{
		if (!this.linkedFrom)
			return 0;
		return Math.min(this.linkedFrom.maxProvidedPerMinute, this.maxTakenPerMinute);
	}

	/** Clear the item binding */
	@action clear() 
	{
		this.item = undefined;
	}

	/** Bind the port to a specific item */
	@action bind(item: ItemKey) 
	{
		this.item = item;
	}

	/** Links to the provided links */
	@action linkWith(link: Link) 
	{
		this.linkedFrom = link;
	}

	/** Unlinks from the link */
	@action unlink() 
	{
		this.linkedFrom = undefined;
	}
}

