import type { LanguageData } from "./Model";

export const english: LanguageData = {
	satisfactory: {
		items: {
			iron: {
				name: "Iron",
				description: "Used for crafting. The most essential basic resource.",
			},
			limestone: "Limestone",
			copper: "Copper",
			coal: "Coal",
			caterium: {
				name: "Caterium",
				description: "Caterium Ore is smelted into Caterium Ingots. Caterium Ingots are mostly used for advanced electronics.",
			},
			bauxite: {
				name: "Bauxite",
				description: "Bauxite is used to produce Alumina, which can be further refined into the Aluminum Scrap required to produce Aluminum Ingots.",
			},
			sulfur: "Sulfur",
			quartz: "Quartz",
			uranium: "Uranium",
			sam: "S.A.M. Ore",
			category: {
				resource: "Resource",
			},
		},
		"resourceNode": {
			"purity": {
				"title": "Purity",
				"impure": "Impure",
				"normal": "Normal",
				"pure": "Pure",
			},
		},
	},
	designer: {
		menu: {
			"file": "File",
			"file.new": "New Project",
			"file.open": "Open Project...",
		},
		canvas: {
			delete: {
				commandText: "Delete",
				dialogTitle: "Delete Node?",
				dialogMessage: "Are you sure you want to delete this node?",
				dialogOkButton: "Delete",
				dialogCancelButton: "Abort",
			},
		},
	},
};