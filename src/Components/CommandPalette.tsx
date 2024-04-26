import { ItemCategory } from "@/Data/Satisfactory";
import { useDatabase } from "@/Hooks/DatabaseProvider";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, MenuItem, MenuList, makeStyles } from "@fluentui/react-components";
import { BeakerAddFilled, BeakerAddRegular, bundleIcon } from "@fluentui/react-icons";
import { Item } from "./Item";
import { Stack } from "./Stack";

export function CommandPalette() 
{
	const BeakerAddIcon = bundleIcon(BeakerAddFilled, BeakerAddRegular);

	const database = useDatabase();
	const style = useCommandPaletteStyle();

	return <Stack className={style.root}>
		<Accordion className={style.root}>
			<AccordionItem value="resources">
				<AccordionHeader>Resources</AccordionHeader>
				<AccordionPanel>
					<MenuList>
						{database.items.getByCategory(ItemCategory.Resource)
							.map(item => <MenuItem key={item.key}>
								<Item item={item} commands={<MenuItem icon={<BeakerAddIcon />}>Add to Design</MenuItem>} />
							</MenuItem>)}
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


