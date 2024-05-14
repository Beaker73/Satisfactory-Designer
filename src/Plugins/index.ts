import { raceAll } from "@/Helpers/Async";

/** Default export required to be exported by a module */
export interface Plugin {
	// other plugins by key this module depends on
	dependsOn?: string[],
}


export async function loadPlugins() 
{
	// tell vite to load all the plugins in the folder
	const plugins: Record<string, Promise<{default: Plugin}>> = import.meta.glob(["./*.ts", "!**/index.ts"], { eager: true });

	// map them in such a way that they can be awaited using raceAll
	// without loosing the link between the path and the plugin
	const entries = Object.entries(plugins)
		.map(
			([path, promise]) => new Promise<[path: string, plugin: Plugin]>(
				// eslint-disable-next-line no-async-promise-executor -- i am not eating an exception, await makes handling T|Promise<T> easier.
				async (resolve, reject) => 
				{
					try 
					{
						// remove ./ in front and .ts add end
						// we can hardcode this, we harcoded reading from that path
						const trimmedPath = path.substring(2, path.length - 4);

						const plugin = await promise;
						resolve([trimmedPath, plugin.default]);
					}
					catch(x) 
					{
						reject(x);
					}
				},
			),
		);

	const loaded: Record<string, Plugin> = {};

	// await the result one-by-one, as they are loaded
	for await(const [path, plugin] of raceAll(...entries))
	{
		loaded[path] = plugin;
	}

	console.debug("loaded", { loaded });
}

