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
			ironMining: {
				name: "Iron Mining",
				duration: 1,
				inputs: {
					ironOre: { count: 1, tag: "unmined" },
				},
				outputs: {
					ironOre: 1,
				},
			},
			copperMining: {
				name: "Copper Mining",
				duration: 1,
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
				allowedRecipes: ["ironMining", "copperMining"],
				variants: {
					mk1: {
						name: "Mk1",
						description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 60 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
						image: minerMk1ImagePath,
					},
					mk2: {
						name: "Mk2",
						description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 120 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
						image: minerMk2ImagePath,
					},
					mk3: {
						name: "Mk3",
						description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 240 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
						image: minerMk3ImagePath,
					},
				},
			},
		},
	},

} satisfies Plugin;