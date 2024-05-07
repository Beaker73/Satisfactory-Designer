import type { BrandVariants } from "@fluentui/react-components";
import { FluentProvider, createDarkTheme, createLightTheme } from "@fluentui/react-components";
import { StoreProvider, useStoreRehydrated } from "easy-peasy";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Shell } from "@/Components/Shell";
import { store, useStoreActions, useStoreState } from "@/Store";
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { Loading } from "./Components/Loading";
import { DatabaseProvider } from "./Hooks/DatabaseProvider";
import { DialogProvider } from "./Hooks/Dialogs";
import { TranslationProvider } from "./Hooks/Translations";

export function App() 
{
	return <StoreProvider store={store}>
		<ThemedApp />
	</StoreProvider>;
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
	const activeProject = useStoreState(state => state.projects.activeProject);
	const [isStartingUp, setIsStartingUp] = useState(true);

	useEffect(() => 
	{
		if(isRehydrated && isStartingUp) 
		{
			if(activeProject) 
			{
				console.debug("load triggered");
				loadProject({ project: activeProject })
					.then(() => 
					{
						console.debug("is started up");
						setIsStartingUp(false);
						return true;
					})
					.catch(() => { /** what now? */});
			}
		}
	}, [activeProject, isRehydrated, isStartingUp, loadProject]);

	console.debug("render", { isRehydrated, isStartingUp });

	const theme = useMemo(() =>
		themeName === "dark"
			? createDarkTheme(satisfactoryVariants)
			: createLightTheme(satisfactoryVariants)
	, [themeName]);

	return <FluentProvider theme={theme} className="root">
		<TranslationProvider>
			<DatabaseProvider>
				<DialogProvider>
					<DndProvider backend={HTML5Backend}>
						{isStartingUp && <Loading message="Initializing" />}
						{!isStartingUp && <Shell />}
					</DndProvider>
				</DialogProvider>
			</DatabaseProvider>
		</TranslationProvider>
	</FluentProvider>;
}