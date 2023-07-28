import { Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Toolbar, ToolbarButton, makeStyles, shorthands, tokens, type MenuProps } from "@fluentui/react-components";
import { Settings24Filled, Settings24Regular, bundleIcon } from "@fluentui/react-icons";
import { useCallback, useState } from "react";

import { Stack } from "@/Components/Stack";
import { useStoreActions, useStoreState } from "@/Store";
import type { Theme } from "@/Store/Settings";

export function CommandBar() 
{
	const SettingsIcon = bundleIcon(Settings24Filled, Settings24Regular);
	const styles = useStyles();

	return <Stack.Item className={styles.appBar}>
		<Stack horizontal>
			<Stack.Item grow>
				<Toolbar>
				</Toolbar>
			</Stack.Item>
			<Stack.Item>
				<Toolbar>
					<Menu>
						<MenuTrigger>
							<ToolbarButton icon={<SettingsIcon />} />
						</MenuTrigger>
						<MenuPopover>
							<MenuList>
								<ThemeMenu />
							</MenuList>
						</MenuPopover>
					</Menu>
				</Toolbar>
			</Stack.Item>
		</Stack>
	</Stack.Item>;
}


const useStyles = makeStyles({
	appBar: {
		...shorthands.borderBottom(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
	},
});





function ThemeMenu() 
{
	const theme = useStoreState(store => store.settings.theme);
	const setTheme = useStoreActions(store => store.settings.setTheme);
	const [checkedValues, setCheckedValues] = useState<Record<string, string[]>>({ theme: [theme ?? "dark"] });
	const onChange = useCallback<NonNullable<MenuProps["onCheckedValueChange"]>>(
		(_e, { name, checkedItems }) => 
		{
			setCheckedValues(s => ({ ...s, [name]: checkedItems }));
			if (name === "theme") 
			{
				const choice = checkedItems[0];
				if (choice)
					setTheme({ theme: choice as Theme });
			}
		}, [setTheme]);

	return <Menu>
		<MenuTrigger>
			<MenuItem>Theme</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList checkedValues={checkedValues} onCheckedValueChange={onChange}>
				<MenuItemRadio name="theme" value="light">Light</MenuItemRadio>
				<MenuItemRadio name="theme" value="dark">Dark</MenuItemRadio>
			</MenuList>
		</MenuPopover>
	</Menu>;

}