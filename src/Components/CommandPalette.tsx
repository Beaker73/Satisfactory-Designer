import type { Item as ItemData } from "@/Data/Satisfactory";
import { ItemCategory } from "@/Data/Satisfactory";
import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useSatisfactoryText } from "@/Hooks/Translations";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Link, MenuItem, MenuList, Text, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useCallback } from "react";
import { ContextPopup } from "./ContextPopup";
import { Stack } from "./Stack";

export function CommandPalette() 
{
	const database = useDatabase();
	const style = useCommandPaletteStyle();

	return <Stack className={style.root}>
		<Accordion className={style.root}>
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
		</Accordion>
	</Stack>;
}

const useCommandPaletteStyle = makeStyles({
	root: {
		minWidth: "200px",
	},
});

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

	return <ContextPopup content={<ItemTooltip item={item} />}>
		<Stack horizontal gap>
			<ItemIcon item={item} />
			<Text>{t(item.displayName)}</Text>
		</Stack>
	</ContextPopup>;
}



interface ItemTooltipProps {
	item: ItemData,
}

function ItemTooltip(props: ItemTooltipProps) 
{
	const { item } = props;
	const t = useSatisfactoryText();

	const style = useItemTooltipStyles();

	const element = useCallback((dt: string, dd: string | number) => 
	{
		return <>
			<dt className={style.term}>{dt}</dt>
			<dd className={style.definition}>{dd}</dd>
		</>;
	}, [style.definition, style.term]);

	return <Stack className={style.root}>
		<Text size={500}>{t(item.displayName)}</Text>
		{item.description && <Text size={200}>{t(item.description)}</Text>}
		<img className={style.image} src={`images/${props.item.key}.png`} />
		<dl className={style.list}>
			{element("Category", t(`items.category.${item.category}`))}
			{element("Stack size", item.stackSize)}
			{item.sinkPoints && element("Sink points", item.sinkPoints)}
		</dl>
		<Link href="https://satisfactory.wiki.gg/wiki/Bauxite" target="_blank">Goto wiki</Link>
	</Stack>;
}

const useItemTooltipStyles = makeStyles({
	root: {
		position: "relative",
		width: "220px",
		paddingRight: "30px",
	},
	image: {
		position: "absolute",
		display: "block",
		...shorthands.border("solid 1px green"),
		...shorthands.padding("8px"),
		...shorthands.borderRadius(tokens.borderRadiusLarge),
		backgroundColor: tokens.colorNeutralBackground2,
		right: "-48px",
		top: "-8px",
		width: "64px",
		height: "64px",
		boxShadow: `${tokens.shadow8}`,
	},
	list: {},
	term: {
		marginTop: tokens.spacingVerticalM, 
		fontSize: tokens.fontSizeBase200, 
		fontWeight: 100,
		textWrap: "nowrap",
	},
	definition: {
		...shorthands.margin(0),
	},
});