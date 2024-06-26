import type { Plugin } from "../../index";
import ironNodeImagePath from "./IronNode.png";
import ironOreImagePath from "./IronOre.png";

export default {

	data: {
		items: {
			ironOre: {
				name: "Iron",
				category: "resource",
				description: "Used for crafting. The most essential basic resource.",
				image: ironOreImagePath,
				wikiPage: "Iron_Ore",
				stackSize: 100,
				sinkPoints: 1,
			},
		},
		recipes: {
			ironNodeImpure: {
				name: "Impure",
				duration: 2,
				outputs: { ironOre: { count: 1, tag: "unmined" } },
			},
			ironNodeNormal: {
				name: "Normal",
				duration: 1,
				outputs: { ironOre: { count: 1, tag: "unmined" } },
			},
			ironNodePure: {
				name: "Pure",
				duration: 0.5,
				outputs: { ironOre: { count: 1, tag: "unmined" } },
			},
		},
		buildings: {
			ironNode: {
				name: "Iron Node",
				category: "resource",
				image: ironNodeImagePath,
				allowedRecipes: ["ironNodeImpure", "ironNodeNormal", "ironNodePure"],
				defaultRecipe: "ironNodeNormal",
			},
		},
	},

} satisfies Plugin;