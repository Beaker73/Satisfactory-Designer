import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";

const rootElement = document.getElementById("root");
if (rootElement instanceof HTMLElement) 
{
	const root = ReactDOM.createRoot(rootElement);
	if (root) 
	{
		root.render(<React.StrictMode>
			<App />
		</React.StrictMode>);
	}
}
