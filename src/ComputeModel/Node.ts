import { defaultDatabase } from "@/Hooks/DatabaseContext";
import type { Building, BuildingVariant } from "@/Model/Building";
import type { Guid } from "@/Model/Identifiers";
import { newGuid } from "@/Model/Identifiers";
import type { Position } from "@/Model/Position";
import type { Recipe } from "@/Model/Recipe";
import { action, makeObservable, observable } from "mobx";
import { Port } from "./Port";

export type NodeId = Guid<"Node">;

export class Node 
{
	id: NodeId = newGuid();

	/** The selected building */
	building: Building;
	/** The variant of the bulding */
	variant: BuildingVariant | undefined = undefined;
	/** The selected recipe */
	recipe: Recipe | undefined = undefined;
	/** The input ports */
	inputPorts: Port[];
	/** The output ports */
	outputPorts: Port[];
	/** The absolute position of the node */
	position: Position = [0,0];

	constructor(id: NodeId, building: Building, recipe?: Recipe) 
	{
		this.id = id;
		this.inputPorts = [0,1,2,3].map(ix => new Port(this, "input", ix));
		this.outputPorts = [0,1,2,3].map(ix => new Port(this, "output", ix));

		makeObservable(this, {
			id: false,
			building: observable,
			variant: observable,
			recipe: observable,
			inputPorts: observable,
			outputPorts: observable,
			position: observable,
			moveTo: action,
			serialize: false,
		});

		const database = defaultDatabase();
		this.building = building;
		this.variant = building.variants ? ( building.defaultVariant ? building.variants[building.defaultVariant] : Object.values(building.variants)[0] ) : undefined;

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
	 * Moves the node to the provided position
	 * @param newPosition The position to move the node to
	 */
	public moveTo(newPosition: Position) 
	{
		this.position[0] += Math.round(newPosition[0] / 16) * 16;
		this.position[1] += Math.round(newPosition[1] / 16) * 16;
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

