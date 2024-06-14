import { hasValue } from "@/Helpers";
import { defaultDatabase } from "@/Hooks/DatabaseContext";
import type { Building, BuildingVariant } from "@/Model/Building";
import type { Guid } from "@/Model/Identifiers";
import { newGuid } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
import type { Position } from "@/Model/Position";
import type { Recipe } from "@/Model/Recipe";
import { action, computed, observable, reaction } from "mobx";
import { InputPort } from "./InputPort";
import { OutputPort } from "./OutputPort";
import type { Project } from "./Project";

export type NodeId = Guid<"Node">;
export type IngredientsPerMinute = { item: ItemKey, perMinute: number, tag?: string };

export class Node 
{
	id: NodeId = newGuid();

	/** The project the node belongs to */
	@observable accessor project: Project | undefined;

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

	/** The list of available building variants */
	@computed get allowedVariants(): BuildingVariant[] 
	{
		return this.building.variants ? Object.values(this.building.variants) : [];
	}

	/** The list of currently allowed recipes */
	@computed get allowedRecipes(): Recipe[] 
	{
		const database = defaultDatabase();
		const allowedKeys = this.variant?.allowedRecipes ?? this.building?.allowedRecipes;
		return allowedKeys?.map(key => database.recipes.getByKey(key)).filter(hasValue) ?? [];
	}

	protected constructor(id: NodeId, building: Building, recipe?: Recipe) 
	{
		this.id = id;

		this.inputPorts = [...Array(building?.inputs ?? 4)].map(() => new InputPort(newGuid(), this));
		this.outputPorts = [...Array(building?.outputs ?? 4)].map(() => new OutputPort(newGuid(), this));
		this.recipe = recipe;

		const database = defaultDatabase();

		reaction(
			() => this.variant,
			_ => 
			{
				if (this.allowedRecipes.length === 0) 
				{
					// clear if no recipe allowed
					this.recipe = undefined;
				}
				else 
				{
					// clear recipe if this one is not valid anymore
					if (this.recipe && this.allowedRecipes.findIndex(r => r.key == this.recipe!.key) == -1)
						this.recipe = undefined;

					// try to set default recipe if variant was switched
					if (!this.recipe) 
					{
						// if some ports are connected, try auto set based on inputs
						if(this.inputPorts.some(ip => ip.isConnected)) 
						{
							const firstMatching = this.allowedRecipes.find(r => this
								.inputPorts
								.filter(ip => ip.isConnected) // for all connected ports
								.every(ip => Object.values(r.inputs!).some(i => i.item === ip.item)), // input port ingredient is found in recipe
							);
							
							if(firstMatching)
								this.recipe = firstMatching;
						}

						// if no recipe and all ports unconnect, start with default recipe
						if(!this.recipe && this.inputPorts.every(ip => !ip.isConnected)) 
						{
							const defaultRecipeKey = building.defaultRecipe ?? building.allowedRecipes?.[0];
							const defaultRecipe = defaultRecipeKey ? database.recipes.getByKey(defaultRecipeKey) : undefined;
							if (defaultRecipe) 
							{
								this.recipe = defaultRecipe;
							}
						}
					}
				}
			},
		);

		// when recipe changes, rebind the ports to new items based on the new recipe
		reaction(
			() => this.recipe,
			recipe => 
			{
				if (!recipe || !recipe.outputs)
					this.outputPorts.forEach(p => p.clear());
				else
					Object.values(recipe.outputs).forEach((recipe, ix) => this.outputPorts[ix].bind(recipe.item));

				if (!recipe || !recipe.inputs)
					this.inputPorts.forEach(p => p.clear());
				else
					Object.values(recipe.inputs).forEach((recipe, ix) => this.inputPorts[ix].bind(recipe.item));
			},
		);

		this.building = building;
		this.variant = this.allowedVariants[0];
		
		const defaultRecipe = this.variant?.defaultRecipe ?? this.building?.defaultRecipe;
		if(defaultRecipe)
			this.recipe = database.recipes.getByKey(defaultRecipe);
	}

	/**
	 * Switch to the provided recipe
	 * @param recipe The recipe to switch to
	 * @throws Error when recipe is not in list of allowed recipes
	 */
	@action public switchRecipe(recipe: Recipe) 
	{
		const notFound = this.allowedRecipes.every(r => r.key !== recipe.key);
		if (notFound)
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
		const notFound = this.allowedVariants.every(v => v.key !== variant.key);
		if (notFound)
			throw new Error("Variant not allowed");

		this.variant = variant;
	}

	private readonly nothing: IngredientsPerMinute[] = [];

	/**
	 * Computes the number of items / m3 created per minute
	 * based of the recipe and the incoming via input ports
	 */
	@computed get createdPerMinute(): IngredientsPerMinute[] 
	{
		const { recipe } = this;

		// abort if no recipe
		if (!recipe)
			return this.nothing;

		// if their are no inputs to the recipe
		// the output is always generated at max
		if (!recipe.inputs) 
		{
			if (!recipe.outputs)
				return this.nothing;

			return Object.values(recipe.outputs)
				.map(i => ({ item: i.item, perMinute: 60 / recipe.duration * i.count, tag: i.tag }));
		}
		if (!recipe.outputs)
			return this.nothing;

		// map ports to recipe
		const map = this.inputPorts.map(
			port => 
			{
				if (port.item) 
				{
					const ingredient = recipe.inputs![port.item];
					if (ingredient)
						return { ingredient, port } as const;
				}
				return undefined;
			},
		);

		// if the final map shows some missing ingredients, return nothing
		const hasMissing = map.some(m => m === undefined);
		if (hasMissing)
			return this.nothing;

		// TS does not detect that we ensured no undefines, so force it
		const nmap = map as NoUndefined<typeof map>;

		// now check the maximum speed can be managed based on the ingredients supplied.
		const pct = nmap.map(
			({ ingredient, port }) => 
			{
				const c = 60 / recipe.duration * ingredient.count;
				const t = port.takenPerMinute;
				return t / c;
			},
		).reduce((r, n) => Math.min(r, n), 1);

		// based on final pct, generate new output
		return Object.values(recipe.outputs!).map(ingredient => 
		{
			return {
				item: ingredient.item,
				perMinute: (60 / recipe.duration * ingredient.count) * pct,
				tag: ingredient.tag,
			};
		});
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
		return new Node(newGuid(), building);
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

type NoUndefined<T> = T extends Array<infer I> ? Array<NonNullable<I>> : T;