import type { Plugin } from "../../index";
import { default as copperNodeImagePath, default as copperOreImagePath } from "./CopperOre.png";

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
		recipes: {
			copperNodeImpure: { name: "Impure", duration: 2, outputs: { copperOre: 1 } },
			copperNodeNormal : { name: "Normal", duration: 1, outputs: { copperOre: 1 } },
			copperNodePure: { name: "Pure", duration: 0.5, outputs: { copperOre: 1 } },
		},
		buildings: {
			copperNode: {
				name: "Copper Node",
				category: "resource",
				image: copperNodeImagePath,
				allowedRecipes: ["copperNodeImpure", "copperNodeNormal", "copperNodePure"],
				defaultRecipe: "copperNodeNormal",
			},
		},
	},

} satisfies Plugin;