import type { BrandVariants } from "@fluentui/react-components";
import { FluentProvider, createDarkTheme, createLightTheme } from "@fluentui/react-components";
import { StoreProvider } from "easy-peasy";

import { Shell } from "@/Components/Shell";
import { store, useStoreState } from "@/Store";
import { useMemo } from "react";
import { DialogProvider } from "./Hooks/Dialogs";

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

	const theme = useMemo(() =>
		themeName === "dark"
			? createDarkTheme(satisfactoryVariants)
			: createLightTheme(satisfactoryVariants)
	, [themeName]);

	return <FluentProvider theme={theme} className="root">
		<DialogProvider>
			<Shell />
		</DialogProvider>
	</FluentProvider>;
}