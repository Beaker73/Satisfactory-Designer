import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, MenuItem, MenuList, makeStyles } from "@fluentui/react-components";
import { BeakerAddFilled, BeakerAddRegular, bundleIcon } from "@fluentui/react-icons";

import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useDesignerText } from "@/Hooks/Translations";
import { newGuid } from "@/Model/Identifiers";
import type { Node } from "@/Model/Node";
import { useStoreActions } from "@/Store";

import type { BuildingCategoryKey } from "@/Model/Building";
import { knownBuildingCategories } from "@/Model/Building";
import { Item } from "./Item";
import { Stack } from "./Stack";

export function CommandPalette() 
{
	const style = useCommandPaletteStyle();

	return <Stack className={style.root}>
		<Accordion className={style.root}>
			<BuildingAccordion category={knownBuildingCategories.resource} />
			<BuildingAccordion category={knownBuildingCategories.extraction} />
			<BuildingAccordion category={knownBuildingCategories.factory} />
		</Accordion>
	</Stack>;
}

const useCommandPaletteStyle = makeStyles({
	root: {
		minWidth: "200px",
	},
});

interface BuildingAccordionProps {
	category: BuildingCategoryKey,
}

function BuildingAccordion(props: BuildingAccordionProps) 
{
	const { category } = props;

	const database = useDatabase();
	const buildings = database.buildings.getByCategory(category);

	const addNode = useStoreActions(store => store.nodes.addNode);
	const dt = useDesignerText();

	const BeakerAddIcon = bundleIcon(BeakerAddFilled, BeakerAddRegular);

	return <AccordionItem value={category}>
		<AccordionHeader>{dt(`item.category.${category}`, { count: buildings.length })}</AccordionHeader>
		<AccordionPanel>
			<MenuList>
				{buildings.map(building => 
				{
					function addItemToDesign() 
					{
						const node: Node = {
							id: newGuid(),
							position: [16, 16],
							buildingKey: building.key,
							recipeKey: building.defaultRecipe,
						};

						addNode({ node });
					}
					return <MenuItem key={building.key} onClick={addItemToDesign}>
						<Item item={building}
							commands={<MenuItem icon={<BeakerAddIcon />}
								onClick={addItemToDesign}>
								Add to Design
							</MenuItem>} />
					</MenuItem>;
				})}
			</MenuList>
		</AccordionPanel>
	</AccordionItem>;
}
