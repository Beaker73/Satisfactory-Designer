import type { Plugin } from "@/Plugins";
import copperIngotImagePath from "./CopperIngot.webp";
import ironIngotImagePath from "./IronIngot.webp";
import smelterImagePath from "./Smelter.png";

export default {

	dependsOn: [
		"Resources/Iron", "Resources/Copper",
	],


	data: {
		items: {
			ironIngot: {
				name: "Iron Ingot",
				description: "Used for crafting. Crafted into the most basic parts.",
				category: "ingot",
				image: ironIngotImagePath,
				stackSize: 100,
				sinkPoints: 2,
			},
			copperIngot: {
				name: "Copper Ingot",
				description: "Used for crafting. Crafted into the most basic parts.",
				category: "ingot",
				image: copperIngotImagePath,
				stackSize: 100,
				sinkPoints: 6,
			},
		},
		recipes: {
			ironIngot: {
				name: "Iron Ingot",
				duration: 2,
				inputs: {
					ironOre: 1,
				},
				outputs: {
					ironIngot: 1,
				},
			},
			copperIngot: {
				name: "Copper Ingot",
				duration: 2,
				inputs: {
					copperOre: 1,
				},
				outputs: {
					copperIngot: 1,
				},
			},
		},
		buildings: {
			smelter: {
				name: "Smelter",
				description: "Smelts ore into ingots. Can be automated by feeding ore into it with a conveyor belt connected to the input. The produced ingots can be automatically extracted by connecting a conveyor belt to the output.",
				category: "factory",
				image: smelterImagePath,
				allowedRecipes: ["ironIngot", "copperIngot"],
			},
		},
	},

} satisfies Plugin;