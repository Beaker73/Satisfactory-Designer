import { FluentProvider, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { StoreProvider } from "easy-peasy";

import { Shell } from "@/Components";
import { store, useStoreState } from "@/Store";

export function App()
{
	return <StoreProvider store={store}>
		<ThemedApp />
	</StoreProvider>;
}

function ThemedApp() 
{
	const themeName = useStoreState(state => state.settings.theme);
	const theme = themeName === "light" ? webLightTheme :webDarkTheme;

	return <FluentProvider theme={theme} className="root">
		<Shell />
	</FluentProvider>;
}