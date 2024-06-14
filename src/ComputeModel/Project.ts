import type { ProjectId } from "@/Model/Project";
import { action, observable } from "mobx";
import type { Link } from "./Link";
import type { Node } from "./Node";

export class Project 
{
	readonly id: ProjectId;

	@observable accessor nodes: Node[] = [];
	@observable accessor links: Link[] = [];

	constructor(id: ProjectId) 
	{
		this.id = id;
	}

	static new(projectId: ProjectId): Project 
	{
		return new Project(projectId);
	}

	/**
	 * Adds a new node to the project
	 * @param node The node to add to the project
	 */
	@action addNode(node: Node) 
	{
		this.nodes.push(node);
		node.project = this;
	}

	/**
	 * Removes an existing node from the project
	 * @param node THe node to remove from the project
	 */
	@action removeNode(node: Node) 
	{
		const ix = this.nodes.findIndex(n => n.id === node.id);
		if(ix !== -1) 
		{
			const node = this.nodes.splice(ix, 1)[0];
			const links = this.links.filter(l => l.source.parentNode.id === node.id || l.target.parentNode.id === node.id);

			for(const link of links)
				this.removeLink(link);
		}
	}

	@action removeLink(link: Link)
	{
		const ix = this.links.findIndex(l => l.id === link.id);
		if(ix !== -1)
			this.links.splice(ix, 1)[0];
	}

	/**
	 * Adds a new link to the project
	 * @param link The link to add to the project
	 */
	@action addLink(link: Link) 
	{
		this.links.push(link);
		link.project = this;
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