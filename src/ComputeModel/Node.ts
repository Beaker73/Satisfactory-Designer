import { defaultDatabase } from "@/Hooks/DatabaseContext";
import type { Building, BuildingVariant } from "@/Model/Building";
import type { Guid } from "@/Model/Identifiers";
import { newGuid } from "@/Model/Identifiers";
import type { Position } from "@/Model/Position";
import type { Recipe } from "@/Model/Recipe";
import { action, observable, reaction } from "mobx";
import { InputPort } from "./InputPort";
import { OutputPort } from "./OutputPort";

export type NodeId = Guid<"Node">;

export class Node 
{
	id: NodeId = newGuid();

	/** The selected building */
	@observable accessor building: Building;
	/** The variant of the bulding */
	@observable accessor variant: BuildingVariant | undefined = undefined;
	/** The selected recipe */
	@observable accessor recipe: Recipe | undefined = undefined;
	/** The input ports */
	@observable accessor inputPorts: InputPort[];
	/** The output ports */
	@observable accessor outputPorts: OutputPort[];
	/** The absolute position of the node */
	@observable accessor position: Position = { x: 0, y: 0 };

	protected constructor(id: NodeId, building: Building, recipe?: Recipe) 
	{
		this.id = id;
		this.inputPorts = [0,1,2,3].map(_ix => new InputPort(newGuid(), this));
		this.outputPorts = [0,1,2,3].map(_ix => new OutputPort(newGuid(), this));

		const database = defaultDatabase();
		this.building = building;
		this.variant = building.variants ? ( building.defaultVariant ? building.variants[building.defaultVariant] : Object.values(building.variants)[0] ) : undefined;

		// when recipe changes, rebind the ports to new items based on the new recipe
		reaction(
			() => this.recipe,
			recipe => 
			{
				if(!recipe || !recipe.outputs)
					this.outputPorts.forEach(p => p.clear());
				else
					Object.values(recipe.outputs).forEach((recipe, ix) => this.outputPorts[ix].bind(recipe.item));

				if(!recipe || !recipe.inputs)
					this.inputPorts.forEach(p => p.clear());
				else
					Object.values(recipe.inputs).forEach((recipe, ix) => this.inputPorts[ix].bind(recipe.item));
			},
		);

		if (!recipe) 
		{
			const defaultRecipeKey = building.defaultRecipe ?? building.allowedRecipes?.[0];
			const defaultRecipe = defaultRecipeKey ? database.recipes.getByKey(defaultRecipeKey) : undefined;
			if (defaultRecipe) 
			{
				this.recipe = defaultRecipe;
			}
		}
		else 
		{
			this.recipe = recipe;
		}

	}

	/**
	 * Switch to the provided recipe
	 * @param recipe The recipe to switch to
	 * @throws Error when recipe is not in list of allowed recipes
	 */
	@action public switchRecipe(recipe: Recipe) 
	{
		
		const allowedRecipes = this.building.allowedRecipes;
		
		const notFound = !allowedRecipes || allowedRecipes.every(r => r !== recipe.key);
		if(notFound)
			throw new Error("Recipe not allowed");

		this.recipe = recipe;
	}

	/**
	 * Switch to the provided variant
	 * @param variant The variant to switch to
	 * @throws Error when no variants are defined, or a variant for wrong building is provided
	 */
	@action public switchVariant(variant: BuildingVariant) 
	{
		const variants = this.building.variants;

		const notFound = !variants || Object.keys(variants).every(v => v !== variant.key);
		if(notFound)
			throw new Error("Variant not allowed");

		this.variant = variant;
	}

	/**
	 * Moves the node to the provided position
	 * @param newPosition The position to move the node to
	 */
	@action public moveTo(newPosition: Position) 
	{
		this.position = {
			x: Math.round(newPosition.x / 16) * 16,
			y: Math.round(newPosition.y / 16) * 16,
		};
	}

	/**
	 * Creates a node for the provided building
	 * @param building The building to create the node for
	 * @returns The created node
	 */
	public static createForBuilding(building: Building): Node 
	{
		const database = defaultDatabase();
		const recipe = building.defaultRecipe ? database.recipes.getByKey(building.defaultRecipe): undefined;

		return new Node(newGuid(), building, recipe);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static parse(data: any): Node 
	{
		const database = defaultDatabase();

		const building = database.buildings.getByKey(data.building)!;
		const recipe = database.recipes.getByKey(data.recipe);

		const node = new Node(data.id, building, recipe);
		return node;
	}

	public serialize(): unknown
	{
		return {
			id: this.id,
			building: this.building.key,
			recipe: this.recipe?.key,
		};
	}
}

