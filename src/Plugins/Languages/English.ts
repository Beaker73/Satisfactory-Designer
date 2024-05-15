import { US } from "country-flag-icons/react/3x2";
import type { Plugin } from "../index";

/** The plugin that contains the dutch language */
export default {

	data: {
		languages: {
			en: {
				image: US,
				app: {

					menu: {
						file: "File",
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
			},
		},
	},

} satisfies Plugin;