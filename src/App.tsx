import type { BrandVariants } from "@fluentui/react-components";
import { FluentProvider, createDarkTheme, createLightTheme } from "@fluentui/react-components";
import { StoreProvider, useStoreRehydrated } from "easy-peasy";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Shell } from "@/Components/Shell";
import { store, useStoreActions, useStoreState } from "@/Store";
import { Loading } from "./Components/Loading";
import { TranslationProvider } from "./Components/TranslationProvider";
import { DatabaseProvider } from "./Hooks/DatabaseProvider";
import { DialogProvider } from "./Hooks/Dialogs";
import { loadPlugins } from "./Plugins";

export function App() 
{

	return <StoreProvider store={store}>
		<PluginProvider>
			<ThemedApp />
		</PluginProvider>
	</StoreProvider>;
}

function PluginProvider(props: PropsWithChildren) 
{
	const [pluginsReady, setPluginsReady] = useState(false);
	useEffect(() => 
	{
		loadPlugins()
			.then(() => void (setPluginsReady(true)))
			.catch(x => { console.error("failed to load plugins", x); });
	}, []);

	if (!pluginsReady)
		return <Loading message="Loading plugins" />;

	return props.children;
}

const satisfactoryVariants: BrandVariants = {
	10: "#050202",
	20: "#211413",
	30: "#381F1D",
	40: "#4A2823",
	50: "#5D3129",
	60: "#703B2F",
	70: "#834534",
	80: "#975039",
	90: "#AA5C3D",
	100: "#BD6841",
	110: "#D07544",
	120: "#E38246",
	130: "#F59048",
	140: "#FCA45E",
	150: "#FEBA7F",
	160: "#FFCEA2",
};

function ThemedApp() 
{
	const themeName = useStoreState(state => state.settings.theme);
	const isRehydrated = useStoreRehydrated();
	const loadProject = useStoreActions(store => store.projects.loadProject);
	const newProject = useStoreActions(store => store.projects.newProject);
	const activeProject = useStoreState(state => state.projects.activeProject);
	const [isStartingUp, setIsStartingUp] = useState(true);
	const hasNodes = useStoreState(store => "nodes" in store);

	useEffect(() => 
	{
		if (isRehydrated && isStartingUp) 
		{
			if (activeProject) 
			{
				console.debug("load triggered");
				loadProject({ project: activeProject })
					.then(() => 
					{
						console.debug("is started up");
						setIsStartingUp(false);
						return true;
					})
					.catch(() => { /** what now? */ });
			}
			else 
			{
				// no initial file (first time)
				newProject()
					.then(() => { setIsStartingUp(false); return true; })
					.catch(() => { /** what now? */ });
			}
		}
	}, [activeProject, isRehydrated, isStartingUp, loadProject, newProject]);

	console.debug("render", { isRehydrated, isStartingUp });

	const theme = useMemo(() =>
		themeName === "dark"
			? createDarkTheme(satisfactoryVariants)
			: createLightTheme(satisfactoryVariants)
	, [themeName]);

	return <FluentProvider theme={theme} className="root" style={{ colorScheme: themeName }}>
		<TranslationProvider>
			<DatabaseProvider>
				<DialogProvider>
					<DndProvider backend={HTML5Backend}>
						{(isStartingUp || !hasNodes) && <Loading message="Initializing" />}
						{!isStartingUp && hasNodes && <Shell />}
					</DndProvider>
				</DialogProvider>
			</DatabaseProvider>
		</TranslationProvider>
	</FluentProvider>;
}