import type { Plugin } from "../../../index";
import minerMk1ImagePath from "./miner.mk1.webp";
import minerMk2ImagePath from "./miner.mk2.webp";
import minerMk3ImagePath from "./miner.mk3.webp";

export default {

	dependsOn: [
		"Resources/Iron",
		"Resources/Copper",
	],

	data: {

		recipes: {
			ironMiningMk1: {
				name: "Iron Mining",
				duration: 1,
				inputs: {
					ironOre: { count: 1, tag: "unmined" },
				},
				outputs: {
					ironOre: 1,
				},
			},
			copperMiningMk1: {
				name: "Copper Mining",
				duration: 1,
				inputs: {
					copperOre: { count: 1, tag: "unmined" },
				},
				outputs: {
					copperOre: 1,
				},
			},
			ironMiningMk2: {
				name: "Iron Mining",
				duration: 0.5,
				inputs: {
					ironOre: { count: 1, tag: "unmined" },
				},
				outputs: {
					ironOre: 1,
				},
			},
			copperMiningMk2: {
				name: "Copper Mining",
				duration: 0.5,
				inputs: {
					copperOre: { count: 1, tag: "unmined" },
				},
				outputs: {
					copperOre: 1,
				},
			},
			ironMiningMk3: {
				name: "Iron Mining",
				duration: 0.25,
				inputs: {
					ironOre: { count: 1, tag: "unmined" },
				},
				outputs: {
					ironOre: 1,
				},
			},
			copperMiningMk3: {
				name: "Copper Mining",
				duration: 0.25,
				inputs: {
					copperOre: { count: 1, tag: "unmined" },
				},
				outputs: {
					copperOre: 1,
				},
			},
		},

		buildings: {
			miner: {
				name: "Miner",
				description: "Extracts solid resources from the resource node it is built on.",
				category: "extraction",
				image: minerMk1ImagePath,
				variants: {
					mk1: {
						name: "Mk1",
						description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 60 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
						image: minerMk1ImagePath,
						allowedRecipes: ["ironMiningMk1", "copperMiningMk1"],
					},
					mk2: {
						name: "Mk2",
						description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 120 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
						image: minerMk2ImagePath,
						allowedRecipes:  ["ironMiningMk2", "copperMiningMk2"],
					},
					mk3: {
						name: "Mk3",
						description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 240 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
						image: minerMk3ImagePath,
						allowedRecipes:  ["ironMiningMk3", "copperMiningMk3"],
					},
				},
			},
		},
	},

} satisfies Plugin;