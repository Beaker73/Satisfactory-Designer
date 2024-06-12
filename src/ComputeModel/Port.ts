import { defaultDatabase } from "@/Hooks/DatabaseContext";
import { newGuid, type Guid } from "@/Model/Identifiers";
import { computed, observable } from "mobx";
import type { Node } from "./Node";


export type PortId = Guid<"Port">;

export class Port 
{
	id: PortId = newGuid();

	@observable accessor node: Node;
	@observable accessor type: "input" | "output";
	@observable accessor index: number;

	@computed get ingredients() 
	{
		return Object.values((this.type === "input" ? this.node.recipe?.inputs : this.node.recipe?.outputs) ?? []);
	}

	@computed get isVisible() 
	{
		return this.index < this.ingredients.length;
	}

	@computed get item() 
	{
		if(!this.isVisible)
			return undefined;

		const database = defaultDatabase();
		const ingredient = this.ingredients[this.index];
		const item = database.items.getByKey(ingredient.item)!;
		
		return item;
	}

	@computed get count() 
	{
		return this.ingredients[this.index]?.count ?? 0;
	}

	@computed get tag() 
	{
		return this.ingredients[this.index]?.tag;
	}

	constructor(parentNode: Node, type: "input" | "output", index: number) 
	{
		this.node = parentNode;
		this.type = type;
		this.index = index;
	}

	/** The number of items per minute this port provides */
	@computed get itemsPerMinute() 
	{
		if (!this.node.recipe)
			return 0;

		const duration = this.node.recipe.duration;
		return 60 / duration * this.count;
	}
}
