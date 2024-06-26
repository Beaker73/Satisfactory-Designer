import type { BrandVariants } from "@fluentui/react-components";
import { FluentProvider, createDarkTheme, createLightTheme } from "@fluentui/react-components";
import { StoreProvider } from "easy-peasy";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Shell } from "@/Components/Shell";
import { store, useStoreActions, useStoreState } from "@/Store";
import { observer } from "mobx-react-lite";
import { Loading } from "./Components/Loading";
import { TranslationProvider } from "./Components/TranslationProvider";
import { DatabaseProvider } from "./Hooks/DatabaseProvider";
import { DialogProvider } from "./Hooks/Dialogs";
import type { Database } from "./Plugins";
import { loadPlugins } from "./Plugins";

export const App = observer(() =>
{
	const [database, setDatabase] = useState<Database | undefined>();

	return <StoreProvider store={store}>
		<PluginProvider onDatabaseLoaded={setDatabase}>
			<TranslationProvider>
				{database && <DatabaseProvider database={database}>
					<ThemedApp />
				</DatabaseProvider>}
				{!database && <Loading message="Loading database" />}
			</TranslationProvider>
		</PluginProvider>
	</StoreProvider>;
});


interface PluginProviderProps {
	onDatabaseLoaded(database: Database): void;
}

const PluginProvider = observer(function PluginProvider(props: PropsWithChildren<PluginProviderProps>) 
{
	const [pluginsReady, setPluginsReady] = useState(false);
	useEffect(() => 
	{
		loadPlugins()
			.then(database => 
			{
				props?.onDatabaseLoaded?.(database); 
				setPluginsReady(true);
				return;
			})
			.catch(x => { console.error("failed to load plugins", x); });
	}, [props]);

	if (!pluginsReady)
		return <Loading message="Loading plugins" />;

	return props.children;
});

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

const ThemedApp = observer(() =>
{
	const themeName = useStoreState(state => state.settings.theme);
	const loadProject = useStoreActions(store => store.projects.loadProject);
	const newProject = useStoreActions(store => store.projects.newProject);
	const activeProject = useStoreState(state => state.projects.activeProject);
	const [isStartingUp, setIsStartingUp] = useState(true);

	useEffect(() => 
	{
		if (isStartingUp) 
		{
			if (activeProject) 
			{
				loadProject({ project: activeProject })
					.then(() => 
					{
						setIsStartingUp(false);
						return true;
					})
					.catch((x) => 
					{ 
						console.error(x);
						/** what now? */ 
					});
			}
			else 
			{
				// no initial file (first time)
				newProject()
					.then(() => { setIsStartingUp(false); return true; })
					.catch(() => { /** what now? */ });
			}
		}
	}, [activeProject, isStartingUp, loadProject, newProject]);

	const theme = useMemo(() =>
		themeName === "dark"
			? createDarkTheme(satisfactoryVariants)
			: createLightTheme(satisfactoryVariants)
	, [themeName]);

	return <FluentProvider theme={theme} className="root" style={{ colorScheme: themeName }}>
		<DialogProvider>
			<DndProvider backend={HTML5Backend}>
				{(isStartingUp) && <Loading message="Initializing" />}
				{!isStartingUp && <Shell />}
			</DndProvider>
		</DialogProvider>
	</FluentProvider>;
});
