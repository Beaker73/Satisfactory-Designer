import { useDesignerText, useSatisfactoryText } from "@/Hooks/Translations";
import type { Building } from "@/Model/Building";
import type { Item as FicsitItem } from "@/Model/Item";
import { Divider, MenuItem, MenuList, Text, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { OpenFilled, OpenRegular, bundleIcon } from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import { useCallback } from "react";
import { ContextPopup } from "./ContextPopup";
import { Stack } from "./Stack";


export interface ItemProps {
	item: Building | FicsitItem,
	commands?: ReactElement,
}

export const Item = observer((props: ItemProps) =>
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
			<Text>{t(item.nameKey)}</Text>
		</Stack>
	</ContextPopup>;
});

interface ItemIconProps {
	item: Building | FicsitItem,
	size?: number,
}

export const ItemIcon = observer((props: ItemIconProps) =>
{
	const size = props.size ?? 24;
	return <img src={props.item.imageUrl} width={size} height={size} />;
});


interface ItemTooltipProps {
	item: Building | FicsitItem,
	commands?: ReactElement,
}

export const ItemTooltip = observer((props: ItemTooltipProps) =>
{
	const { item, commands } = props;
	const st = useSatisfactoryText();
	const dt = useDesignerText();

	const style = useItemTooltipStyles();

	//const db = useDatabase();
	// const variants = item.variants ? db.variants.getByKey(item.variants) : undefined;
	//const st = useSatisfactoryText();

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
			<Text size={500} weight="semibold" >{st(item.nameKey)}</Text>
			{item.descriptionKey && <Text size={200} style={{ opacity: .6 }}>{st(item.descriptionKey)}</Text>}
			<img className={style.image} src={item.imageUrl} />
			<dl className={style.list}>
				{element(dt("item.category.label"), dt(`item.category.${item.category}`, { count: 1 }))}
				{"stackSize" in item && item.stackSize && element(dt("item.stackSize.label"), item.stackSize)}
				{"sinkPoints" in item && item.sinkPoints && element(dt("item.sinkPoints.label"), item.sinkPoints)}
				{/* {variants && element(`${st(variants.displayName)} Variants`, variants.types.map(type => st(type.displayName)))} */}
			</dl>
		</Stack>
	</Stack>;
});

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
		borderRadius: tokens.borderRadiusLarge,
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