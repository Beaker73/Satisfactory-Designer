import { action, computed, observable } from "mobx";

import type { Guid } from "@/Model/Identifiers";
import { newGuid } from "@/Model/Identifiers";

import { defaultDatabase } from "@/Hooks/DatabaseContext";
import type { Building, BuildingKey, BuildingVariant } from "@/Model/Building";
import { knownBuildingCategories } from "@/Model/Building";
import type { InputPort } from "./InputPort";
import type { OutputPort } from "./OutputPort";

export type LinkId = Guid<"Link">;

export class Link 
{
	readonly id: LinkId = newGuid();

	/** The source port the items come from */
	@observable accessor source: OutputPort;

	/** The target port the items flow to */
	@observable accessor target: InputPort;

	/** The building (MUST be of type category transport) */
	@observable accessor building: Building;
	@observable accessor variant: BuildingVariant | undefined = undefined;

	/** The list of available building variants */
	@computed get allowedVariants(): BuildingVariant[] 
	{
		return this.building.variants ? Object.values(this.building.variants) : [];
	}

	constructor(id: LinkId, source: OutputPort, target: InputPort, initialBuilding: Building )
	{
		if(initialBuilding.category !== knownBuildingCategories.transport)
			throw new Error("Only transport buildings can be used");

		this.id = id;
		this.source = source;
		this.target = target;
		this.building = initialBuilding;
		this.variant = fastestVariant(initialBuilding);

		target.linkWith(this);
	}

	/** The maximum that can every be transported (i.e. max of this belt or pipeline) */
	@computed get maxTransportedPerMinute()
	{
		return this.variant?.maxPerMinute ?? this.building?.maxPerMinute ?? 0;
	}

	/** The maximum that can be provided based on the provided amount from the source building */
	@computed get maxProvidedPerMinute() 
	{
		return Math.min(
			this.variant?.maxPerMinute ?? this.building.maxPerMinute!,
			this.source.outputedPerMinute,
		) ?? 0;
	}

	/** The items per minutes flowing over the link, based on max provided vs. max taken */
	@computed get transportedPerMinute() 
	{
		return Math.min(
			this.maxProvidedPerMinute,
			this.target.takenPerMinute,
		);
	}

	@action switchVariant(newVariant: BuildingVariant): void 
	{
		if(newVariant.category !== knownBuildingCategories.transport)
			throw new Error("Only transport buildings can be used");
		if(this.allowedVariants.every(v => v.key !== newVariant.key))
			throw new Error("This variant does not belong to this type of building");

		this.variant = newVariant;
	}

	/**
	 * Creates a new link between the provided source and destination
	 * @param source The source output port
	 * @param target The target input port
	 * @returns The created link between these to ports
	 */
	public static createBetween(source: OutputPort, target: InputPort)
	{
		const database = defaultDatabase();
		const belt = database.buildings.getByKey("belt" as BuildingKey)!;
		
		return new Link(newGuid(), source, target, belt);
	}
}

function fastestVariant(building: Building): BuildingVariant | undefined
{
	if(!building.variants)
		return undefined;

	const variants = Object.values(building.variants);
	const fastest = variants.reduce((f, v) => f = (v.maxPerMinute ?? 0) > (f.maxPerMinute ?? 0) ? v : f, variants[0]);

	return fastest;
}