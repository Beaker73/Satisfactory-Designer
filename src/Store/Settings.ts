import { action, type Action } from "easy-peasy";

export type Theme = "light" | "dark";

export interface SettingsModel {
	theme: Theme,
	setTheme: Action<SettingsModel, {theme: Theme}>,
}

export const settingsImpl: SettingsModel = {
	theme: "light",
	setTheme: action((store, { theme }) => void(store.theme = theme) ),
};