import type { RecursiveKey } from "../Helpers";

export interface LanguageItemData {
	name: string,
	description: string,
}

export interface LanguageData {
	/** The satisfactory namespace */
	satisfactory: {
		item: {
			ironOre: LanguageItemData,
			limestoneOre: string,
			copperOre: string,
			coalOre: string,
			cateriumOre: LanguageItemData,
			bauxiteOre: LanguageItemData,
			sulfurOre: string,
			quartzOre: string,
			uraniumOre: string,
			samOre: string,
			category: {
				resource: string,
			}
		},
		resourceNode: {
			purity: {
				title: string,
				impure: string,
				normal: string,
				pure: string,
			}
		}
	},
	designer: {
		menu: {
			"file": string,
			"file.new": string,
			"file.open": string,
		},
		canvas: {
			delete: {
				commandText: string,
				dialogTitle: string,
				dialogMessage: string,
				dialogOkButton: string,
				dialogCancelButton: string,
			}
		}
	}
}

export type ResourceKey = RecursiveKey<LanguageData["satisfactory"]>;
export type DesignerResourceKey = RecursiveKey<LanguageData["designer"]>;
