import type { RecursiveKey } from "../Helpers";

export interface LanguageItemData {
	name: string,
	description: string,
}

export interface LanguageData {
	/** The satisfactory namespace */
	satisfactory: {
		items: {
			iron: LanguageItemData,
			limestone: string,
			copper: string,
			coal: string,
			caterium: LanguageItemData,
			bauxite: LanguageItemData,
			sulfur: string,
			quartz: string,
			uranium: string,
			sam: string,
			category: {
				resource: string,
			}
		}
	},
	designer: {
		menu: {
			"file": string,
			"file.new": string,
			"file.open": string,
		}
	}
}

export type ResourceKey = RecursiveKey<LanguageData["satisfactory"]>;
export type DesignerResourceKey = RecursiveKey<LanguageData["designer"]>;
