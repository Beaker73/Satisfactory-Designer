import { NL } from "country-flag-icons/react/3x2";
import type { Plugin } from "../index";

/** The plugin that contains the dutch language */
export default {

	data: {
		languages: {
			nl: {
				image: NL,
				
				items: {
					ironOre: {
						name: "IJzer",
						description: "Gebruikt voor vervaardingen. De meest essentiële basishulpbron.",
					},
				},

				app: {
					menu: {
						file: "Bestand",
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

			},
		},
	},

} satisfies Plugin;