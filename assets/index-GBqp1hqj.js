const copperNodeImagePath = "/Satisfactory-Designer/assets/CopperOre-Bh_r3fWR.png";

const index = {
    data: {
        items: {
            copperOre: {
                name: "Copper",
                category: "resource",
                description: "Used for crafting. Basic resource mainly used for electricity.",
                image: copperNodeImagePath,
                wikiPage: "Copper_Ore",
                stackSize: 100,
                sinkPoints: 3
            }
        },
        recipes: {
            copperNodeImpure: {
                name: "Impure",
                duration: 2,
                outputs: {
                    copperOre: {
                        count: 1,
                        tag: "unmined"
                    }
                }
            },
            copperNodeNormal: {
                name: "Normal",
                duration: 1,
                outputs: {
                    copperOre: {
                        count: 1,
                        tag: "unmined"
                    }
                }
            },
            copperNodePure: {
                name: "Pure",
                duration: 0.5,
                outputs: {
                    copperOre: {
                        count: 1,
                        tag: "unmined"
                    }
                }
            }
        },
        buildings: {
            copperNode: {
                name: "Copper Node",
                category: "resource",
                image: copperNodeImagePath,
                allowedRecipes: [
                    "copperNodeImpure",
                    "copperNodeNormal",
                    "copperNodePure"
                ],
                defaultRecipe: "copperNodeNormal"
            }
        }
    }
};

export { index as default };
