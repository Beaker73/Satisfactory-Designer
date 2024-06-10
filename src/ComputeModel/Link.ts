import { computed, makeObservable, observable } from "mobx";

import type { Guid } from "@/Model/Identifiers";
import { newGuid } from "@/Model/Identifiers";

import type { Port } from "./Port";

export type LinkId = Guid<"Link">;

export class Link 
{
	readonly id: LinkId = newGuid();

	/** The source port the items come from */
	source: Port;

	/** The target port the items flow to */
	target: Port;

	constructor(id: LinkId, source: Port, target: Port) 
	{
		this.id = id;
		this.source = source;
		this.target = target;

		makeObservable(this, {
			id: false,
			source: observable,
			target: observable,
			itemsPerMinute: computed,
		});
	}

	/** The items per minutes flowing over the link */
	get itemsPerMinute() 
	{
		const spm = this.source?.itemsPerMinute ?? 0;
		const tpm = this.target?.itemsPerMinute ?? 0;

		return Math.min(spm, tpm);
	}

	public static createBetween(source: Port, target: Port)
	{
		const link = new Link(newGuid(), source, target);
		return link;
	}
}
