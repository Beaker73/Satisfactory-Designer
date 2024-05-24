import { NL } from "country-flag-icons/react/3x2";
import type { Plugin } from "../index";

/** The plugin that contains the dutch language */
export default {

	data: {
		languages: {
			nl: {
				image: () => <NL />,
				name: "Nederlands",

				items: {
					ironOre: {
						name: "IJzer",
						description: "Gebruikt voor vervaardingen. De meest essentiële basis grondstofbron.",
					},
					copperOre: {
						name: "Koper",
						description: "Gebruikt voor vervaardigen. Basis grondstofbron die voornamelijk wordt gebruikt voor elektriciteit.",
					},
				},
				recipes: {
					ironNodeImpure: { name: "Onzuiver" },
					ironNodeNormal: { name: "Normaal" },
					ironNodePure: { name: "Zuiver" },
				},
				buildings: {
					ironNode: {
						name: "IJzer grondstofbron",
					},
				},

				app: {
					menu: {
						file: "Bestand",
						"file.new": "Nieuw Project",
						"file.open": "Open Project...",
						settings: {
							theme: {
								label: "Thema",
								light: "Licht",
								dark: "Donker",
							},
							language: {
								label: "Taal",
							},
						},
					},
					canvas: {
						delete: {
							commandText: "Verwijder",
							dialogTitle: "Verwijder onderdeel?",
							dialogMessage: "Weet je zeker dat je dit onderdeel wilt verwijderen?",
							dialogOkButton: "Verwijderen",
							dialogCancelButton: "Afbreken",
						},
					},
					item: {
						category: {
							label: "Categorie",
							resource_one: "Grondstof",
							resource_other: "Grondstoffen",
						},
						"stackSize.label": "Stapel hoogte",
						"sinkPoints.label": "Stort punten",
					},
				},

			},
		},
	},

} satisfies Plugin;