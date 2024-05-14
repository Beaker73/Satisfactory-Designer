import type { LanguageData } from "./Model";

export const dutch: LanguageData = {
	satisfactory: {
		item: {
			ironOre: {
				name: "IJzer",
				description: "Gebruikt voor vervaardingen. De meest essentiële basishulpbron.",
			},
			limestoneOre: "Kalksteen",
			copperOre: "Koper",
			coalOre: "Kolen",
			cateriumOre: {
				name: "Caterium",
				description: "Caterium-erts wordt gesmolten tot Caterium-staven. Caterium-staven worden meestal gebruikt voor geavanceerde elektronica.",
			},
			bauxiteOre: {
				name: "Bauxiet",
				description: "Bauxiet wordt gebruikt om aluminiumoxide te produceren, dat verder kan worden verfijnd tot aluminiumschroot dat nodig is om aluminium staven te produceren.",
			},
			sulfurOre: "Zwavel",
			quartzOre: "Kwarts",
			uraniumOre: "Uranium",
			samOre: "V.B.M. Erts",
			category: {
				resource: "Hulpbron",
			},
		},
		resourceNode: {
			purity: {
				title: "Zuivheid",
				impure: "Onzuiver",
				normal: "Normaal",
				pure: "Zuiver",
			},
		},
	},
	designer: {
		menu: {
			"file": "Bestand",
			"file.new": "Nieuw Project",
			"file.open": "Open Project...",
		},
		canvas: {
			delete: {
				commandText: "Verwijder",
				dialogTitle: "Onderdeel verwijder?",
				dialogMessage: "Weet je zeker dat je dit onderdeel wilt verwijderen?",
				dialogOkButton: "Verwijderen",
				dialogCancelButton: "Afbreken",
			},
		},
	},
};