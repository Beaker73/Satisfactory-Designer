import { US } from "country-flag-icons/react/3x2";
import type { Plugin } from "../index";

/** The plugin that contains the dutch language */
export default {

	data: {
		languages: {
			en: {
				image: () => <US />,
				name: "English",
				app: {

					menu: {
						file: "File",
						"file.new": "New Project",
						"file.open": "Open Project...",
						settings: {
							theme: {
								label: "Theme",
								light: "Light",
								dark: "Dark",
							},
							language: {
								label: "Language",
							},
						},
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

					item: {
						category: {
							label: "Category",
							resource_one: "Resource",
							resource_other: "Resources",
							extraction_one: "Extractor",
							extraction_other: "Extractors",
							factory_one: "Factory",
							factory_other: "Factories",
						},
						tag: {
							unmined: "Unmined",
						},
						"stackSize.label": "Stack Size",
						"sinkPoints.label": "Sink Points",
					},
					
				},
			},
		},
	},

} satisfies Plugin;