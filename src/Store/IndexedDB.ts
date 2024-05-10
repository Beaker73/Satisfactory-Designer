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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const db = (event.target as any).result as IDBDatabase;

			resolve({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				getItem: (_key: string): Promise<any> | null => 
				{
					return new Promise((resolve) =>
					{
						const nodeStore = db
							.transaction(["nodes"], "readwrite")
							.objectStore("nodes");

						nodeStore.getAll().onsuccess = ev => 
						{
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const nodes = (ev.target as any).result as Node[];
							const result = { nodesById: Object.fromEntries(nodes.map(node => [node.id, node])) };
							resolve(result);
						};
					});
				},
				setItem: async (_key: string, data: NodesModel): Promise<void> => 
				{
					const nodeStore = db
						.transaction(["nodes"], "readwrite")
						.objectStore("nodes");

					const keys = await new Promise<string[]>(resolve => nodeStore.getAllKeys().onsuccess = ev =>
					{
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const keys = (ev.target as any).result as string[];
						resolve(keys);
					});

					for(const value of Object.values(data.nodesById)) 
					{
						const ix = keys.findIndex(v => v == value.id);
						if(ix !== -1)
							keys.splice(ix, 1);
						nodeStore.put(value);
					}

					for(const key of keys) 
						nodeStore.delete(key);
				},
				removeItem: (_key: string): void => 
				{
					//
				},
			});
		};
	});

}