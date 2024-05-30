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
			copperNodeImpure: { name: "Impure", duration: 2, outputs: { copperOre: { count: 1, tag: "unmined" } } },
			copperNodeNormal : { name: "Normal", duration: 1, outputs: { copperOre: { count: 1, tag: "unmined" } } },
			copperNodePure: { name: "Pure", duration: 0.5, outputs: { copperOre: { count: 1, tag: "unmined" } } },
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