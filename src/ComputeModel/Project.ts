import type { ProjectId } from "@/Model/Project";
import { action, makeObservable, observable } from "mobx";
import type { Link } from "./Link";
import type { Node } from "./Node";

export class Project 
{
	readonly id: ProjectId;

	nodes: Node[] = [];
	links: Link[] = [];

	constructor(id: ProjectId) 
	{
		this.id = id;

		makeObservable(this, { 
			id: false,
			nodes: observable,
			links: observable,
			addNode: action,
			removeNode: action,
			addLink: action,
			serialize: false,
		});
	}

	public static new(projectId: ProjectId): Project 
	{
		return new Project(projectId);
	}

	/**
	 * Adds a new node to the project
	 * @param node The node to add to the project
	 */
	public addNode(node: Node) 
	{
		this.nodes.push(node);
	}

	/**
	 * Removes an existing node from the project
	 * @param node THe node to remove from the project
	 */
	public removeNode(node: Node) 
	{
		const ix = this.nodes.findIndex(n => n.id === node.id);
		if(ix && ix !== -1)
			this.nodes.splice(ix, 1);
	}

	/**
	 * Adds a new link to the project
	 * @param link The link to add to the project
	 */
	public addLink(link: Link) 
	{
		this.links.push(link);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static parse(data: any): Project 
	{
		const project = new Project(data.id);
		return project;
	}

	public serialize(): unknown
	{
		return {
			id: this.id,
			nodes: this.nodes.map(node => node.serialize()),
		};
	}
}