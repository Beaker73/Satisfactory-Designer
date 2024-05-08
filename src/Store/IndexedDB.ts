import type { Guid } from "@/Model/Guid";
import type { Node } from "@/Model/Node";
import type { PersistStorage } from "easy-peasy";
import type { NodesModel } from "./Nodes";

export function indexedDbProjectStorage(id: Guid): Promise<PersistStorage> 
{
	return new Promise((resolve, reject) => 
	{
		const request = indexedDB.open(id, 1);
		request.onerror = event => 
		{
			console.error("no indexeddb available", event);
			reject(event);
		};
		request.onupgradeneeded = event => 
		{
			const db = (event.target as any).result as IDBDatabase;
			switch(db.version) 
			{
				default:
					db.createObjectStore("nodes", { autoIncrement: true, keyPath: "id" });
					break;
			}
		};
		request.onsuccess = event => 
		{
			const db = (event.target as any).result as IDBDatabase;

			resolve({
				getItem: (_key: string): Promise<any> | null => 
				{
					return new Promise((resolve) =>
					{
						const nodeStore = db
							.transaction(["nodes"], "readwrite")
							.objectStore("nodes");

						nodeStore.getAll().onsuccess = ev => 
						{
							const nodes = (ev.target as any).result as Node[];
							const result = { nodesById: Object.fromEntries(nodes.map(node => [node.id, node])) };
							resolve(result);
						};
					});
				},
				setItem: (_key: string, data: NodesModel): void => 
				{
					const nodeStore = db
						.transaction(["nodes"], "readwrite")
						.objectStore("nodes");

					for(const value of Object.values(data.nodesById))
						nodeStore.put(value);
				},
				removeItem: (_key: string): void => 
				{
					//
				},
			});
		};
	});

}