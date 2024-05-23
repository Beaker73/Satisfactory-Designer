import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useDesignerText } from "@/Hooks/Translations";
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
	const resources = database.items.getByCategory("resource");

	const style = useCommandPaletteStyle();

	const addNode = useStoreActions(store => store.nodes.addNode);
	const dt = useDesignerText();

	return <Stack className={style.root}>
		<Accordion className={style.root}>
			<AccordionItem value="resources">
				<AccordionHeader>{dt("item.category.resource", { count: resources.length })}</AccordionHeader>
				<AccordionPanel>
					<MenuList>
						{resources.map(item => 
						{
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							//const variants = item.variants ? database.variants.getByKey(item.variants)! : undefined;

							function addItemToDesign() 
							{
								const node: Node = {
									id: newGuid(),
									position: [16,16],
									itemKey: item.key,
									//variantKey: variants?.default,
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
			{/* <AccordionItem value="buildings">
				<AccordionHeader>Buildings</AccordionHeader>
				<AccordionPanel>
					<MenuList>
						{database.buildings.getAll().map(building => <MenuItem key={building.key}>
							{building.displayName}
						</MenuItem>)}
					</MenuList>
				</AccordionPanel>
			</AccordionItem> */}
		</Accordion>
	</Stack>;
}

const useCommandPaletteStyle = makeStyles({
	root: {
		minWidth: "200px",
	},
});


