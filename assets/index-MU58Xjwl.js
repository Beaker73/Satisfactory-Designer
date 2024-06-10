const ironNodeImagePath = "/Satisfactory-Designer/assets/IronNode-CjwHB2kr.png";

const ironOreImagePath = "/Satisfactory-Designer/assets/IronOre-jsMT-Xgx.png";

const index = {
    data: {
        items: {
            ironOre: {
                name: "Iron",
                category: "resource",
                description: "Used for crafting. The most essential basic resource.",
                image: ironOreImagePath,
                wikiPage: "Iron_Ore",
                stackSize: 100,
                sinkPoints: 1
            }
        },
        recipes: {
            ironNodeImpure: {
                name: "Impure",
                duration: 2,
                outputs: {
                    ironOre: {
                        count: 1,
                        tag: "unmined"
                    }
                }
            },
            ironNodeNormal: {
                name: "Normal",
                duration: 1,
                outputs: {
                    ironOre: {
                        count: 1,
                        tag: "unmined"
                    }
                }
            },
            ironNodePure: {
                name: "Pure",
                duration: 0.5,
                outputs: {
                    ironOre: {
                        count: 1,
                        tag: "unmined"
                    }
                }
            }
        },
        buildings: {
            ironNode: {
                name: "Iron Node",
                category: "resource",
                image: ironNodeImagePath,
                allowedRecipes: [
                    "ironNodeImpure",
                    "ironNodeNormal",
                    "ironNodePure"
                ],
                defaultRecipe: "ironNodeNormal"
            }
        }
    }
};

export { index as default };
