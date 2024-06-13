const e="/Satisfactory-Designer/assets/miner.mk1-C0pYN36V.webp",n="/Satisfactory-Designer/assets/miner.mk2-Cn_6vcM4.webp",r="/Satisfactory-Designer/assets/miner.mk3-BvGIVH4r.webp",i={dependsOn:["Resources/Iron","Resources/Copper"],data:{recipes:{ironMiningMk1:{name:"Iron Mining",duration:1,inputs:{ironOre:{count:1,tag:"unmined"}},outputs:{ironOre:1}},copperMiningMk1:{name:"Copper Mining",duration:1,inputs:{copperOre:{count:1,tag:"unmined"}},outputs:{copperOre:1}},ironMiningMk2:{name:"Iron Mining",duration:.5,inputs:{ironOre:{count:1,tag:"unmined"}},outputs:{ironOre:1}},copperMiningMk2:{name:"Copper Mining",duration:.5,inputs:{copperOre:{count:1,tag:"unmined"}},outputs:{copperOre:1}},ironMiningMk3:{name:"Iron Mining",duration:.25,inputs:{ironOre:{count:1,tag:"unmined"}},outputs:{ironOre:1}},copperMiningMk3:{name:"Copper Mining",duration:.25,inputs:{copperOre:{count:1,tag:"unmined"}},outputs:{copperOre:1}}},buildings:{miner:{name:"Miner",description:"Extracts solid resources from the resource node it is built on.",category:"extraction",image:e,variants:{mk1:{name:"Mk1",description:"Extracts solid resources from the resource node it is built on. The normal extraction rate is 60 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",image:e,allowedRecipes:["ironMiningMk1","copperMiningMk1"]},mk2:{name:"Mk2",description:"Extracts solid resources from the resource node it is built on. The normal extraction rate is 120 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",image:n,allowedRecipes:["ironMiningMk2","copperMiningMk2"]},mk3:{name:"Mk3",description:"Extracts solid resources from the resource node it is built on. The normal extraction rate is 240 resources per minute. The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",image:r,allowedRecipes:["ironMiningMk3","copperMiningMk3"]}}}}}};export{i as default};
