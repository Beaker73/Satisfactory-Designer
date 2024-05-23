import type { Plugin } from "../../index";
import copperOreImagePath from "./CopperOre.png";

export default {

	data: {
		items: {
			copperOre: {
				name: "Copper",
				category: "resource",
				description: "Used for crafting. Basic resource mainly used for electricity.",
				image: copperOreImagePath,
				wikiPage: "Copper_Ore",
				stackSize: 100,
				sinkPoints: 3,
			},
		},
	},

} satisfies Plugin;