import { defaultDatabase } from "@/Hooks/DatabaseContext";
import { newGuid, type Guid } from "@/Model/Identifiers";
import { computed, makeObservable, observable } from "mobx";
import type { Node } from "./Node";


export type PortId = Guid<"Port">;

export class Port 
{
	id: PortId = newGuid();

	public readonly node: Node;
	public readonly type: "input" | "output";
	public readonly index: number;

	public get ingredients() 
	{
		return Object.values((this.type === "input" ? this.node.recipe?.inputs : this.node.recipe?.outputs) ?? []);
	}

	public get isVisible() 
	{
		return this.index < this.ingredients.length;
	}

	public get item() 
	{
		if(!this.isVisible)
			return undefined;

		const database = defaultDatabase();
		const ingredient = this.ingredients[this.index];
		const item = database.items.getByKey(ingredient.item)!;
		
		return item;
	}

	public get count() 
	{
		return this.ingredients[this.index]?.count ?? 0;
	}

	public get tag() 
	{
		return this.ingredients[this.index]?.tag;
	}

	constructor(parentNode: Node, type: "input" | "output", index: number) 
	{
		this.node = parentNode;
		this.type = type;
		this.index = index;
		
		makeObservable(this, {
			id: false,
			node: observable,
			type: observable,
			index: observable,
			isVisible: computed,
			ingredients: computed,
			item: computed,
			count: computed,
			tag: computed,
			itemsPerMinute: computed,
		});
	}

	/** The number of items per minute this port provides */
	// @computed 
	get itemsPerMinute() 
	{
		if (!this.node.recipe)
			return 0;

		const duration = this.node.recipe.duration;
		return 60 / duration * this.count;
	}
}
