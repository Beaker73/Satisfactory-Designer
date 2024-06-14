import { knownBuildingCategories } from "@/Model/Building";
import type { Guid } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
import { action, computed, observable } from "mobx";
import type { InputPort } from "./InputPort";
import { Link } from "./Link";
import type { Node } from "./Node";

export type OutputPortId = Guid<"OutputPort">;

/** Output port that supplies outcoming items based on the recipe of the node */
export class OutputPort 
{
	id: OutputPortId;

	/** The parent node of this output port */
	@observable accessor parentNode: Node;
	
	/** The item the port is bound to */
	@observable accessor item: ItemKey | undefined = undefined;
	/** The item tag */
	@observable accessor tag: string | undefined;
	/** If the port is currently visible */
	@computed get isVisible(): boolean { return (this.parentNode.building.category === knownBuildingCategories.logistics) ? true : !!this.item; }

	/** The link this outputor is linked to */
	@observable accessor linkedTo: Link | undefined;
	@computed get isLinked(): boolean { return !!this.linkedTo; }

	/** The number of items/m3 outputted per minute */
	@computed get outputedPerMinute() 
	{
		if(!this.parentNode)
			return 0;

		const i = this.parentNode!.createdPerMinute.find(pm => pm.item === this.item);
		if(!i)
			return 0;

		return i.perMinute;
	}

	/**
	 * Creates a new output port
	 * @param parentNode The parent node this output port is linked to
	 */
	constructor(id: OutputPortId, parentNode: Node) 
	{
		this.id = id;
		this.parentNode = parentNode;
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

	@action linkWith(link: Link)
	{
		this.linkedTo = link;
	}
	
	/**
	 * Link this output to the provided node
	 * @param node The node to link to
	 * @returns The link that has been created or undefined if there was an issue.
	 */
	@action linkTo(port: InputPort): Link | undefined
	{
		let targetPort: InputPort | undefined = port;

		// find port of same item on node
		if(targetPort.parentNode.building.category !== knownBuildingCategories.logistics) 
		{
			if(targetPort.item !== this.item)
				targetPort = port.parentNode.inputPorts.find(p => p.item === this.item);
		}

		// no target port, then invalid or not found, abort
		if(!targetPort)
			return undefined;

		// already linked?
		if(targetPort.linkedFrom) 
		{
			// link to self, user is dragging same node again, just return existing
			if(targetPort.linkedFrom.source === this)
				return targetPort.linkedFrom;

			// unlink previous link, as user wants to replace it.
			targetPort.linkedFrom.destroy();
		}

		if(this.linkedTo)
		{
			// unlink previous link, as user is dragging it to other target
			this.linkedTo.destroy();
		}

		return Link.createBetween(this, targetPort);
	}
}
