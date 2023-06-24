import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { StoreProvider } from "easy-peasy";
import { type JSX } from "react";

import { Shell } from "./Components/Shell";
import { store } from "./Store";

export function App(): JSX.Element 
{
	return <StoreProvider store={store}>
		<FluentProvider theme={webLightTheme}>
			<Shell />
		</FluentProvider>
	</StoreProvider>;
}