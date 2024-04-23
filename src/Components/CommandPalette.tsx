import type { Item as ItemData } from "@/Data/Satisfactory";
import { ItemCategory } from "@/Data/Satisfactory";
import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useSatisfactoryText } from "@/Hooks/Translations";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, MenuItem, MenuList, Text, Tooltip } from "@fluentui/react-components";
import { Stack } from "./Stack";

export function CommandPalette() 
{
	const database = useDatabase();

	return <Accordion>
		<AccordionItem value="resources">
			<AccordionHeader>Resources</AccordionHeader>
			<AccordionPanel>
				<MenuList>
					{database.items.getByCategory(ItemCategory.Resource)
						.map(item => <MenuItem key={item.key}><Item item={item} /></MenuItem>)}
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
	</Accordion>;
}

interface ItemIconProps {
	item: ItemData,
}

function ItemIcon(props: ItemIconProps) 
{
	return <img src={`images/${props.item.key}.png`} width={24} height={24} />;
}

interface ItemProps {
	item: ItemData,
}

function Item(props: ItemProps) 
{
	const { item } = props;
	const t = useSatisfactoryText();

	return <Tooltip content={<ItemTooltip item={item} />} relationship="description">
		<Stack horizontal tokens={{ childrenGap: 8 }}>
			<ItemIcon item={item} />
			<Text>{t(item.displayName)}</Text>
		</Stack>
	</Tooltip>;
}

interface ItemTooltipProps {
	item: ItemData,
}

function ItemTooltip(props: ItemTooltipProps) 
{
	const { item } = props;
	const t = useSatisfactoryText();

	return <Stack>
		<Text>{t(item.displayName)}</Text>
		<dl>
			<dt>Category</dt>
			<dd>{t(`items.category.${item.category}`)}</dd>
			{item.stackSize && <>
				<dt>Stack size</dt>
				<dd>{item.stackSize}</dd>
			</>}
			{item.sinkPoints && <>
				<dt>Sinkpoints</dt>
				<dd>{item.sinkPoints}</dd>
			</>}
		</dl>
	</Stack>;
}