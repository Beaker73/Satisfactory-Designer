import type { Guid } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
import { action, computed, observable } from "mobx";
import type { Node } from "./Node";

export type InputPortId = Guid<"InputPort">;

/** Input port that accepts incoming items */
export class InputPort
{
	id: InputPortId;

	@observable accessor parentNode: Node;

	/** The item this input port accepts */
	@observable accessor item: ItemKey | undefined;
	/** The item tag */
	@observable accessor tag: string | undefined;
	/** If the port is currently visible */
	@computed get isVisible(): boolean { return !!this.item; }

	/** Creates a new InputPort */
	constructor(id: InputPortId, parentNode: Node) 
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
}

