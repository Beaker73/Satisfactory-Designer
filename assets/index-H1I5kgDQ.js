const minerMk1ImagePath = "/Satisfactory-Designer/assets/miner.mk1-C0pYN36V.webp";

const minerMk2ImagePath = "/Satisfactory-Designer/assets/miner.mk2-Cn_6vcM4.webp";

const minerMk3ImagePath = "/Satisfactory-Designer/assets/miner.mk3-BvGIVH4r.webp";

const index = {
    dependsOn: [
        "Resources/Iron",
        "Resources/Copper"
    ],
    data: {
        recipes: {
            ironMining: {
                name: "Iron Mining",
                duration: 1,
                inputs: {
                    ironOre: {
                        count: 1,
                        tag: "unmined"
                    }
                },
                outputs: {
                    ironOre: 1
                }
            },
            copperMining: {
                name: "Copper Mining",
                duration: 1,
                inputs: {
                    copperOre: {
                        count: 1,
                        tag: "unmined"
                    }
                },
                outputs: {
                    copperOre: 1
                }
            }
        },
        buildings: {
            miner: {
                name: "Miner",
                description: "Extracts solid resources from the resource node it is built on.",
                category: "extraction",
                image: minerMk1ImagePath,
                allowedRecipes: [
                    "ironMining",
                    "copperMining"
                ],
                variants: {
                    mk1: {
                        name: "Mk1",
                        description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 60 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
                        image: minerMk1ImagePath
                    },
                    mk2: {
                        name: "Mk2",
                        description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 120 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
                        image: minerMk2ImagePath
                    },
                    mk3: {
                        name: "Mk3",
                        description: "Extracts solid resources from the resource node it is built on. The normal extraction rate is 240 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
                        image: minerMk3ImagePath
                    }
                }
            }
        }
    }
};

export { index as default };
