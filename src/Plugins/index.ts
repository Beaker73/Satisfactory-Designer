
import { raceAll } from "@/Helpers/Async";
import { deepMerge } from "@/Helpers/Deep";
import { pagePer } from "@/Helpers/StreamingData";
import { store } from "@/Store";
import type { JSX } from "react";
import type { Translation } from "../Model/Translation";

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
export interface LanguageInfo {
	/** The name of the language in their own tongue */
	name: string, 
	/** The flag image */
	image: string | ((props?: any) => JSX.Element)
}
export interface Database {
	languages: Record<string, LanguageInfo>,
	recipes: Recipes;
	items: Items;
}

export type PluginItems = Record<string, PluginItem>;
export interface PluginItem {
	name: string,
	category: string,
	description?: string,
	image?: string,
	wikiPage?: string,
	stackSize?: number,
	sinkPoints?: number,
}

export type Items = Record<string, Item>;
export interface Item {
	/** The unique key of the item */
	key: string,
	/** The category this item belongs to */
	category: string,
	/** The resource key of the display name */
	nameKey: string,
	/** The resource key of the description */
	descriptionKey: string,
	/** The URL of the wiki page of the item */
	wikiUrl?: string,
	/** The path the the image */
	imageUrl?: string,
	/** The maximum size of a stack of items */
	stackSize?: number,
	/** The number of points you get for sinking the item */
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

export type Recipes = Record<string, Recipe>;
export interface Recipe {
	key: string,
	nameKey: string,
	descriptionKey: string,
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
	name: string,
	items?: Record<string, Partial<Pick<PluginItem, "name" | "description">>>,
	recipes?: Record<string, Partial<Pick<PluginRecipe, "name" | "description">>>,
	buildings?: Record<string, Partial<Pick<PluginBuilding, "name" | "description">>>,
	app?: LanguageNode,
}

let loadPluginsResult: Promise<Database> | undefined;


export function loadPlugins(): Promise<Database>
{
	if(loadPluginsResult)
		return loadPluginsResult;

	loadPluginsResult = loadPluginsCore();
	
	return loadPluginsResult;
}

async function loadPluginsCore(): Promise<Database>
{
	// tell vite to load all the plugins in the folder
	const plugins: Record<string, Promise<{ default: Plugin }>> = import.meta.glob(["./**/*.ts", "./**/*.tsx", "!./index.ts"], { eager: true });

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
						trimmed = trimmed.endsWith("/index.ts")	? trimmed.substring(0, trimmed.length - 9)
							: trimmed.endsWith("/index.tsx") ? trimmed.substring(0, trimmed.length - 10)
								: trimmed.endsWith(".ts") ? trimmed.substring(0, trimmed.length - 3)
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
	let data: PluginData = {};

	// await the result one-by-one, as they are loaded
	for await (const [name, plugin] of raceAll(...entries)) 
	{
		console.debug(`loaded ${name}`);
		loaded[name] = plugin;

		tryImport(plugin);
	}

	console.debug("all loaded", { data });

	for(const translations of pagePer(50, extractLanguageKeys(data))) 
		store.getActions().translations.importTranslations({ translations });

	return extractDatabase(data);

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
		data = deepMerge(data, plugin.data);
		console.debug("loading: merged database", { plugin, pluginData: plugin.data, mergedData: data });

	}

	function* extractLanguageKeys(database: PluginData): Generator<Translation>
	{
		function* processLanguage(language: string, database: PluginData | PluginLanguage): Generator<Translation>
		{
			if(database.items)
				for(const [key, item] of Object.entries(database.items))
				{
					if(item.name)
						yield { language, namespace: "satisfactory", key: `item.${key}.name`, text: item.name };
					if(item.description)
						yield { language, namespace: "satisfactory", key: `item.${key}.description`, text: item.description };
				}
			if(database.recipes)
				for(const [key, recipe] of Object.entries(database.recipes))
				{
					if(recipe.name)
						yield { language, namespace: "satisfactory", key: `recipe.${key}.name`, text: recipe.name };
					if(recipe.description)
						yield { language, namespace: "satisfactory", key: `recipe.${key}.description`, text: recipe.description };
				}
			if(database.buildings)
				for(const [key, building] of Object.entries(database.buildings))
				{
					if(building.name)
						yield { language, namespace: "satisfactory", key: `building.${key}.name`, text: building.name };
					if(building.description)
						yield { language, namespace: "satisfactory", key: `building.${key}.description`, text: building.description };
				}

			if("app" in database && database.app) 
			{
				for(const y of processNestedKeys(database.app))
					yield y;
			}

			function* processNestedKeys(node: LanguageNode, prefix?: string): Generator<Translation> 
			{
				if(typeof node === "string")
					yield { language, namespace: "designer", key: prefix ?? "-", text: node };
				else
					for(const [key, subNode] of Object.entries(node))
						for(const y of processNestedKeys(subNode, prefix ? `${prefix}.${key}` : key))
							yield y;
			}
		}

		for(const y of processLanguage("en", database))
			yield y;
		
		if(database.languages) 
			for(const [langCode, language] of Object.entries(database.languages)) 
				for( const y of processLanguage(langCode, language))
					yield y;
	}

	function extractDatabase(data: PluginData) 
	{
		const languages: Record<string, LanguageInfo> = {};
		if(data.languages) 
		{
			console.debug("database languages", { lang: data.languages });
			Object.entries(data.languages).map(([key, lang]) =>
			{
				console.debug("database languages", { key, lang });

				languages[key] = {
					name: lang.name,
					image: lang.image,
				};
			});
		}

		const recipes: Record<string, Recipe> = {};
		if(data.recipes)
			Object.entries(data.recipes).map(([key, recipe]) =>
			{
				recipes[key] = {
					key,
					nameKey: `recipe.${key}.name`,
					descriptionKey: `recipe.${key}.description`,
					duration: recipe.duration,
					inputs: recipe.inputs,
					outputs: recipe.outputs,
				};
			});

		const items: Record<string, Item> = {};
		if(data.items)
			Object.entries(data.items).map(([key, item]) => 
			{
				items[key] = {
					key,
					category: item.category,
					nameKey: `item.${key}.name`,
					descriptionKey: `item.${key}.description`,
					imageUrl: item.image,
					wikiUrl: item.wikiPage ? `https://satisfactory.wiki.gg/wiki/${item.wikiPage}` : undefined,
					stackSize: item.stackSize,
					sinkPoints: item.sinkPoints,
				};
			});

		console.debug("database processed", { languages, recipes, items });

		return {
			languages,
			recipes,
			items,
		};
	}
}


