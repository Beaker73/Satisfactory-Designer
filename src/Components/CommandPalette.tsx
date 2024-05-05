import { ItemCategory } from "@/Data/Satisfactory";
import { useDatabase } from "@/Hooks/DatabaseProvider";
import { newGuid } from "@/Model/Guid";
import type { Node } from "@/Model/Node";
import { useStoreActions } from "@/Store";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, MenuItem, MenuList, makeStyles } from "@fluentui/react-components";
import { BeakerAddFilled, BeakerAddRegular, bundleIcon } from "@fluentui/react-icons";
import { Item } from "./Item";
import { Stack } from "./Stack";

export function CommandPalette() 
{
	const BeakerAddIcon = bundleIcon(BeakerAddFilled, BeakerAddRegular);

	const database = useDatabase();
	const style = useCommandPaletteStyle();

	const addNode = useStoreActions(store => store.nodes.addNode);

	return <Stack className={style.root}>
		<Accordion className={style.root}>
			<AccordionItem value="resources">
				<AccordionHeader>Resources</AccordionHeader>
				<AccordionPanel>
					<MenuList>
						{database.items.getByCategory(ItemCategory.Resource)
							.map(item => 
							{
								function addItemToDesign() 
								{
									const node: Node = {
										id: newGuid(),
										position: [16,16],
										itemKey: item.key,
										variantKey: item.variants?.default,
									};

									addNode({ node });
								}
								return <MenuItem key={item.key} onClick={addItemToDesign}>
									<Item item={item}
										commands={<MenuItem icon={<BeakerAddIcon />}
											onClick={addItemToDesign}>
											Add to Design
										</MenuItem>} />
								</MenuItem>;
							})}
					</MenuList>
				</AccordionPanel>
			</AccordionItem>
			<AccordionItem value="buildings">
				<AccordionHeader>Buildings</AccordionHeader>
				<AccordionPanel>
					<MenuList>
						<MenuItem>Miner</MenuItem>
						<MenuItem>Foundry</MenuItem>
						<MenuItem>Smelter</MenuItem>
						<MenuItem>Constructor</MenuItem>
						<MenuItem>Assembler</MenuItem>
						<MenuItem>Manufacturer</MenuItem>
						<MenuItem>Refinery</MenuItem>
						<MenuItem>Packager</MenuItem>
						<MenuItem>Blender</MenuItem>
						<MenuItem>Particle Accelerator</MenuItem>
					</MenuList>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	</Stack>;
}

const useCommandPaletteStyle = makeStyles({
	root: {
		minWidth: "200px",
	},
});


