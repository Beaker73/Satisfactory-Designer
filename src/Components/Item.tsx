import type { Item as ItemData } from "@/Data/Satisfactory";
import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useSatisfactoryText } from "@/Hooks/Translations";
import { Divider, MenuItem, MenuList, Text, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { OpenFilled, OpenRegular, bundleIcon } from "@fluentui/react-icons";
import type { ReactElement } from "react";
import { useCallback } from "react";
import { ContextPopup } from "./ContextPopup";
import { Stack } from "./Stack";


export interface ItemProps {
	item: ItemData,
	commands?: ReactElement,
}

export function Item(props: ItemProps) 
{
	const OpenIcon = bundleIcon(OpenFilled, OpenRegular);

	const { item, commands } = props;
	const t = useSatisfactoryText();

	const openWiki = useCallback(() => 
	{
		if (item.wikiUrl)
			window.open(item.wikiUrl, "_blank");
	}, [item.wikiUrl]);

	return <ContextPopup positioning="after-top" style={{ padding: tokens.spacingHorizontalL }} content={<ItemTooltip item={item} commands={<>
		{commands}
		{item.wikiUrl && <MenuItem onClick={openWiki} icon={<OpenIcon />}>Open Wiki</MenuItem>}
	</>} />}>
		<Stack horizontal gap>
			<ItemIcon item={item} />
			<Text>{t(item.displayName)}</Text>
		</Stack>
	</ContextPopup>;
}

interface ItemIconProps {
	item: ItemData,
	size?: number,
}

export function ItemIcon(props: ItemIconProps) 
{
	const size = props.size ?? 24;
	return <img src={`images/${props.item.key}.png`} width={size} height={size} />;
}


interface ItemTooltipProps {
	item: ItemData,
	commands?: ReactElement,
}

export function ItemTooltip(props: ItemTooltipProps) 
{
	const { item, commands } = props;
	const t = useSatisfactoryText();

	const style = useItemTooltipStyles();

	const db = useDatabase();
	const variants = item.variants ? db.variants.getByKey(item.variants) : undefined;
	const st = useSatisfactoryText();

	const element = useCallback((dt: string, dd: string | number | string[]) => 
	{
		const isArray = Array.isArray(dd);

		return <>
			<dt>{dt}</dt>
			<dd>
				{isArray && <ul>{dd.map(ddi => <li key={ddi}>{ddi}</li>)}</ul>}
				{!isArray && dd}
			</dd>
		</>;
	}, []);

	return <Stack horizontal gap>
		{commands && <>
			<Stack.Item>
				<MenuList className={style.commands}>
					{commands}
				</MenuList>
			</Stack.Item>
			<Stack.Item>
				<Divider vertical className={style.fullHeight} />
			</Stack.Item>
		</>}
		<Stack className={style.root}>
			<Text size={500} weight="semibold" >{t(item.displayName)}</Text>
			{item.description && <Text size={200} style={{ opacity: .6 }}>{t(item.description)}</Text>}
			<img className={style.image} src={`images/${props.item.key}.png`} />
			<dl className={style.list}>
				{element("Category", t(`item.category.${item.category}`))}
				{element("Stack size", item.stackSize)}
				{item.sinkPoints && element("Sink points", item.sinkPoints)}
				{variants && element(`${st(variants.displayName)} Variants`, variants.types.map(type => st(type.displayName)))}
			</dl>
		</Stack>
	</Stack>;
}

const useItemTooltipStyles = makeStyles({
	root: {
		position: "relative",
		width: "220px",
		paddingRight: "30px",
	},
	commands: {
		minWidth: "150px",
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
	list: {
		"& > dt": {
			marginTop: tokens.spacingVerticalM,
			fontSize: tokens.fontSizeBase200,
			fontWeight: 100,
			textWrap: "nowrap",
			opacity: .6,
		},
		"& > dd": {
			...shorthands.margin(0),
			"& > ul": {
				listStyleType: "none",
				...shorthands.margin(0),
				...shorthands.padding(0),
			},
		},
	},
	fullHeight: {
		height: "100%",
	},
});