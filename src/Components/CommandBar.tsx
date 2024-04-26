import type { InputProps } from "@fluentui/react-components";
import { Input, Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Toolbar, ToolbarButton, makeStyles, shorthands, tokens, type MenuProps } from "@fluentui/react-components";
import { FolderAddFilled, FolderAddRegular, FolderOpenFilled, FolderOpenRegular, SettingsFilled, SettingsRegular, bundleIcon } from "@fluentui/react-icons";
import { Fragment, useCallback, useState } from "react";

import { Stack } from "@/Components/Stack";
import { useDesignerText } from "@/Hooks/Translations";
import { useStoreActions, useStoreState } from "@/Store";
import type { Language, Theme } from "@/Store/Settings";
import { NL, US } from "country-flag-icons/react/3x2";
import { useOpenProjectDialog } from "./OpenProjectDialog";

export function CommandBar() 
{
	const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular);
	const t = useDesignerText();

	const styles = useStyles();

	const project = useStoreState(state => state.projects.activeProject);
	console.debug("project", { project });

	const openProjectDialog = useOpenProjectDialog();

	const changeProjectName = useStoreActions(store => store.projects.changeProjectName);
	const onProjectNameChange = useCallback<NonNullable<InputProps["onChange"]>>((_, data) => 
	{
		if (project)
			changeProjectName({ projectId: project.id, newName: data.value ?? "" });
	}, [changeProjectName, project]);

	return <Fragment>
		<Stack.Item className={styles.appBar}>
			<Stack horizontal verticalAlign="center">
				<Stack.Item>
					<Toolbar>
						<Menu>
							<MenuTrigger>
								<ToolbarButton>{t("menu.file")}</ToolbarButton>
							</MenuTrigger>
							<MenuPopover>
								<MenuList>
									<MenuItemNewProject />
									<MenuItemOpenProject onClick={openProjectDialog} />
								</MenuList>
							</MenuPopover>
						</Menu>
					</Toolbar>
				</Stack.Item>
				<Stack.Item grow>
					<Stack horizontal>
						<Stack.Item grow>&nbsp;</Stack.Item>
						<Stack.Item>
							{project && <Input appearance="filled-lighter" value={project.name} onChange={onProjectNameChange} />}
						</Stack.Item>
						<Stack.Item grow>&nbsp;</Stack.Item>
					</Stack>
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
									<LanguageMenu />
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


function MenuItemNewProject() 
{
	const t = useDesignerText();

	const FolderNewIcon = bundleIcon(FolderAddFilled, FolderAddRegular);
	const newProject = useStoreActions(store => store.projects.newProject);
	return <MenuItem icon={<FolderNewIcon />} onClick={() => newProject()}>{t("menu.file.new")}</MenuItem>;
}

function MenuItemOpenProject(props: { onClick: () => void }) 
{
	const t = useDesignerText();

	const { onClick } = props;
	const FolderOpenIcon = bundleIcon(FolderOpenFilled, FolderOpenRegular);
	return <MenuItem icon={<FolderOpenIcon />} onClick={onClick}>{t("menu.file.open")}</MenuItem>;
}


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

function LanguageMenu() 
{
	const language = useStoreState(store => store.settings.language);
	const setLanguage = useStoreActions(store => store.settings.setLanguage);
	const [checkedValues, setCheckedValues] = useState<Record<string, string[]>>({ theme: [language ?? "en"] });
	const onChange = useCallback<NonNullable<MenuProps["onCheckedValueChange"]>>(
		(_e, { name, checkedItems }) => 
		{
			setCheckedValues(s => ({ ...s, [name]: checkedItems }));
			if (name === "language") 
			{
				const choice = checkedItems[0];
				if (choice)
					setLanguage({ language: choice as Language });
			}
		}, [setLanguage]);

	console.debug("languages: ", { checkedValues });

	return <Menu>
		<MenuTrigger>
			<MenuItem>Language</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList checkedValues={checkedValues} onCheckedValueChange={onChange}>
				<MenuItemRadio name="language" value="en" icon={<US />}>English</MenuItemRadio>
				<MenuItemRadio name="language" value="nl" icon={<NL />}>Nederlands</MenuItemRadio>
			</MenuList>
		</MenuPopover>
	</Menu>;
}