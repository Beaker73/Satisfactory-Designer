
import { raceAll } from "@/Helpers/Async";
import type { JSX } from "react";

/** Default export required to be exported by a module */
export interface Plugin {
	// other plugins by key this module depends on
	dependsOn?: string[],

	data: PluginData,

	// /**
	//  * Initialize the plugin, will only be called after all dependecies where loaded
	//  * @param database The (partially) loaded database
	//  */
	// initialize(database: Database): (Promise<Database> | Database);
}

export interface PluginData {
	items?: PluginItems,
	recipes?: PluginRecipes,
	buildings?: PluginBuildings,
	languages?: PluginLanguages,
}

export type PluginItems = Record<string, PluginItem>;
export interface PluginItem {
	name: string,
	description?: string,
	image?: string,
	stackSize?: number,
	sinkPoints?: number,
}

export type PluginRecipes = Record<string, PluginRecipe>;
export interface PluginRecipe {
	name?: string,
	description?: string,
	duration: number,
	outputs?: Record<string, number>,
	inputs?: Record<string, number>,
}

export type PluginBuildings = Record<string, PluginBuilding>;
export interface PluginBuilding {
	name: string,
	description?: string,
	image?: string,
	category?: string,
	allowedRecipes?: string[],
	variants?: Record<string, Partial<Omit<PluginBuilding, "variants">>>,
}

export type PluginLanguages = Record<string, PluginLanguage>;

// https://github.com/microsoft/TypeScript/pull/33050#issuecomment-543365074
interface RecordI<T> { [k: string]: T }
export type LanguageNode =
	| string
	| RecordI<LanguageNode>
	;

export interface PluginLanguage {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	image: string | ((props: any) => JSX.Element),
	items?: Record<string, Partial<Pick<PluginItem, "name" | "description">>>,
	recipes?: Record<string, Partial<Pick<PluginRecipe, "name" | "description">>>,
	buildings?: Record<string, Partial<Pick<PluginBuilding, "name" | "description">>>,
	app?: LanguageNode,
}


export async function loadPlugins() 
{
	// tell vite to load all the plugins in the folder
	const plugins: Record<string, Promise<{ default: Plugin }>> = import.meta.glob(["./**/*.ts", "!./index.ts"], { eager: true });

	// map them in such a way that they can be awaited using raceAll
	// without loosing the link between the name and the plugin
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
						let trimmed = path.substring(2);
						trimmed = trimmed.endsWith("/index.ts")
							? trimmed.substring(0, trimmed.length - 9)
							: trimmed.endsWith(".ts")
								? trimmed.substring(0, trimmed.length - 3)
								: trimmed;
						console.debug("loaded:::", { path, trimmed });

						const plugin = await promise;
						resolve([trimmed, plugin.default]);
					}
					catch (x) 
					{
						reject(x);
					}
				},
			),
		);

	const loaded: Record<string, Plugin> = {};
	const processed: Record<string, Plugin> = {};
	let database: PluginData = {};

	// await the result one-by-one, as they are loaded
	for await (const [name, plugin] of raceAll(...entries)) 
	{
		console.debug(`loaded ${name}`);
		loaded[name] = plugin;

		tryImport(plugin);
	}

	console.debug("all loaded", { database });

	/**
	 * Tries to import the provided plugin
	 * @param plugin The plugin to try to imprt
	 */
	function tryImport(plugin: Plugin) 
	{
		console.debug("loading: dependency try import", plugin);

		// ensure all dependencies are processed
		// if not, but it is loaded, process dependency first.
		if (plugin.dependsOn) 
		{
			for (const dependency of plugin.dependsOn) 
			{
				if (dependency in processed) 
				{
					// dependency available
					console.debug("loading: dependency ready", dependency);
					continue;
				}
				else if (dependency in loaded) 
				{
					// loaded but not processed, try processing
					if (!tryImport(loaded[dependency])) 
					{
						// fail if processing could not be done (nested dependency?)
						console.debug("loading: dependency failed", dependency);
						return false;
					}
				}
				else 
				{
					// not loaded yet, abort.
					console.debug("loading: dependency abort", dependency);
					return false;
				}
			}
		}

		// if we arrive here, we have no dependencies
		// or all dependencies are processed.
		// TODO: Deep Merge
		database = {
			...database,
			...plugin.data,
		};

		console.debug("loading: merged database", database);

	}
}


