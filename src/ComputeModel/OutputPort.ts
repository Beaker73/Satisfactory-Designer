import type { Guid } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
import { action, computed, observable } from "mobx";
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
	@computed get isVisible(): boolean { return !!this.item; }

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
	
	/**
	 * Link this output to the provided node
	 * @param node The node to link to
	 * @returns The link that has been created or undefined if there was an issue.
	 */
	@action linkTo(node: Node): Link | undefined
	{
		console.log(this.item);
		console.log(node.inputPorts.map(ip => ip.item));

		// find port of same item on node
		const port = node.inputPorts.find(p => p.item === this.item);
		if(!port)
			throw new Error("banana");
			//return undefined;

		return Link.createBetween(this, port);
	}
}
