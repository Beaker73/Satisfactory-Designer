import { Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Toolbar, ToolbarButton, makeStyles, shorthands, tokens, type MenuProps } from "@fluentui/react-components";
import { FolderOpen24Filled, FolderOpen24Regular, Settings24Filled, Settings24Regular, bundleIcon } from "@fluentui/react-icons";
import { Fragment, useCallback, useState } from "react";

import { Stack } from "@/Components/Stack";
import { useStoreActions, useStoreState } from "@/Store";
import type { Theme } from "@/Store/Settings";
import { useOpenProject } from "./OpenProjectDialog";

export function CommandBar() 
{
	const SettingsIcon = bundleIcon(Settings24Filled, Settings24Regular);
	const FolderOpenIcon = bundleIcon(FolderOpen24Filled, FolderOpen24Regular);

	const styles = useStyles();
	const hasRecent = false;

	const { openProject, OpenProjectDialog } = useOpenProject();

	return <Fragment>
		<OpenProjectDialog />
		<Stack.Item className={styles.appBar}>
			<Stack horizontal>
				<Stack.Item grow>
					<Toolbar>
						<Menu>
							<MenuTrigger>
								<ToolbarButton>File</ToolbarButton>
							</MenuTrigger>
							<MenuPopover>
								<MenuList>
									<MenuItem icon={<FolderOpenIcon />} secondaryContent={"Ctrl+O"} onClick={openProject}>Open Project...</MenuItem>
									{hasRecent && <Menu>
										<MenuTrigger>
											<MenuItem>Open Recent</MenuItem>
										</MenuTrigger>
										<MenuPopover>
											<MenuList>
												<MenuItem>Foobar 1</MenuItem>
												<MenuItem>Foobar 2</MenuItem>
											</MenuList>
										</MenuPopover>
									</Menu>}
								</MenuList>
							</MenuPopover>
						</Menu>
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
		</Stack.Item>
	</Fragment>;
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
