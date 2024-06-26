import type { InputProps } from "@fluentui/react-components";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Input, Link, Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Toolbar, ToolbarButton, makeStyles, shorthands, tokens, type MenuProps } from "@fluentui/react-components";
import { ChatBubblesQuestionFilled, ChatBubblesQuestionRegular, FolderAddFilled, FolderAddRegular, FolderOpenFilled, FolderOpenRegular, SaveArrowRightFilled, SaveArrowRightRegular, SettingsFilled, SettingsRegular, bundleIcon } from "@fluentui/react-icons";
import { Fragment, useCallback, useMemo, useState } from "react";

import { Stack } from "@/Components/Stack";
import { useProject } from "@/ComputeModel/ProjectContext";
import { useDatabase } from "@/Hooks/DatabaseContext";
import type { DialogControllerProps } from "@/Hooks/Dialogs";
import { useDialog } from "@/Hooks/Dialogs";
import { useDesignerText } from "@/Hooks/Translations";
import { useStoreActions, useStoreState } from "@/Store";
import type { Language, Theme } from "@/Store/Settings";
import { observer } from "mobx-react-lite";
import { useOpenProjectDialog } from "./OpenProjectDialog";

export const CommandBar = observer(() =>
{
	const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular);
	const t = useDesignerText();

	const styles = useStyles();

	const project = useStoreState(state => state.projects.activeProject);

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
									<MenuItemExportProject />
									<Divider />
									<MenuItemAbout />
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
});

const useStyles = makeStyles({
	appBar: {
		...shorthands.borderBottom(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
	},
});


const MenuItemNewProject = observer(() =>
{
	const t = useDesignerText();

	const FolderNewIcon = bundleIcon(FolderAddFilled, FolderAddRegular);
	const newProject = useStoreActions(store => store.projects.newProject);
	return <MenuItem icon={<FolderNewIcon />} onClick={() => newProject()}>{t("menu.file.new")}</MenuItem>;
});

const MenuItemOpenProject = observer((props: { onClick: () => void }) =>
{
	const t = useDesignerText();

	const { onClick } = props;
	const FolderOpenIcon = bundleIcon(FolderOpenFilled, FolderOpenRegular);
	return <MenuItem icon={<FolderOpenIcon />} onClick={onClick}>{t("menu.file.open")}</MenuItem>;
});

const MenuItemAbout = observer(() =>
{
	const AboutIcon = bundleIcon(ChatBubblesQuestionFilled, ChatBubblesQuestionRegular);

	const aboutDialog = useDialog(AboutDialog);
	const openAboutDialog = useCallback(() => 
	{
		aboutDialog.show({});
	}, [aboutDialog]);

	return <MenuItem icon={<AboutIcon />} onClick={openAboutDialog}>
		About
	</MenuItem>;
});

type AboutDialogProps = DialogControllerProps;


const AboutDialog = observer((props: AboutDialogProps) =>
{
	return <Dialog open={true} modalType="modal">
		<DialogSurface>
			<DialogBody>
				<DialogTitle>About Satisfactory Designer</DialogTitle>
				<DialogContent>
					<p>
						Version 0.1
						<hr />
						This software uses the following open source projects to build upon:
						<ul>
							<li><Link href="https://github.com/microsoft/fluentui?tab=License-1-ov-file#readme" target="_blank">Fluent UI React v9</Link> - for the User Interface</li>
							<li><Link href="https://github.com/ctrlplusb/easy-peasy?tab=MIT-1-ov-file#readme">easy-peasy</Link> - for easy redux</li>
							<li><Link href="https://github.com/immerjs/immer?tab=MIT-1-ov-file#readme">immer</Link> - for easy reducer state updates</li>
							<li><Link href="https://github.com/mobxjs/mobx/blob/main/LICENSE">mobx</Link> - for lazy recomputation of the model</li>
							<li><Link href="https://github.com/kyeotic/raviger?tab=MIT-1-ov-file#readme" target="_blank">Raviger</Link> - for Routing</li>
							<li><Link href="https://github.com/react-dnd/react-dnd?tab=MIT-1-ov-file#readme">React DND</Link> - for Drag and Drop support</li>
							<li><Link href="https://github.com/i18next/i18next?tab=MIT-1-ov-file#readme">i18n</Link> - for Multi language support</li>
							<li><Link href="https://github.com/i18next/react-i18next?tab=MIT-1-ov-file#readme">i18n-react</Link>  - for Multi language support</li>
							<li><Link href="https://github.com/date-fns/date-fns?tab=MIT-1-ov-file#readme">date-fns</Link> - for Date/Time handling</li>
							<li><Link href="https://github.com/uuidjs/uuid?tab=MIT-1-ov-file#readme">uuid</Link> - for Global Unique Identifiers</li>
						</ul>
					</p>
				</DialogContent>
				<DialogActions>
					<DialogTrigger>
						<Button appearance="primary" onClick={() => props.onConfirm()} >Ok</Button>
					</DialogTrigger>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	</Dialog>;
});


const ThemeMenu = observer(()  =>
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

	const dt = useDesignerText();

	return <Menu>
		<MenuTrigger>
			<MenuItem>{dt("menu.settings.theme.label")}</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList checkedValues={checkedValues} onCheckedValueChange={onChange}>
				<MenuItemRadio name="theme" value="light">{dt("menu.settings.theme.light")}</MenuItemRadio>
				<MenuItemRadio name="theme" value="dark">{dt("menu.settings.theme.dark")}</MenuItemRadio>
			</MenuList>
		</MenuPopover>
	</Menu>;
});

const LanguageMenu = observer(() =>
{
	const database = useDatabase();
	const languages = Object.entries(database.languages.getAll());

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

	const dt = useDesignerText();

	return <Menu>
		<MenuTrigger>
			<MenuItem>{dt("menu.settings.language.label")}</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList checkedValues={checkedValues} onCheckedValueChange={onChange}>
				{languages.map(([code, info]) => 
				{
					const image = typeof info.image === "string" ? (() => <Fragment>{info.image as string}</Fragment>) : info.image;
					return <MenuItemRadio name="language" key={code} value={code} icon={image()}>{info.name}</MenuItemRadio>;
				})}
			</MenuList>
		</MenuPopover>
	</Menu>;
});

const MenuItemExportProject = observer(() =>
{
	const ExportIcon = bundleIcon(SaveArrowRightFilled, SaveArrowRightRegular);

	const project = useStoreState(state=>state.projects.activeProject);
	const data = useProject();

	const dt = useDesignerText();

	const downloadLink = useMemo(
		() => 
		{
			const json = JSON.stringify({ type: "project", id: project.id, version: "0.1", name: project.name, data: data?.serialize() });
			const base64 = btoa(json);
			return `data:application/json;base64,${base64}`;
		},
		[data, project.id, project.name],
	);

	const styles = useDownloadStyles();

	return <MenuItem icon={<ExportIcon />}>
		<Link appearance="subtle" href={downloadLink} download={`${project.name.replace(/\s/g, "_")}.sdp`} className={styles.noUnderline} >{dt("menu.file.export")}</Link>
	</MenuItem>;
});

const useDownloadStyles = makeStyles({
	noUnderline: {
		"&:hover": {
			textDecoration: "none",
		},
	},
});