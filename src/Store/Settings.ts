import { action, type Action } from "easy-peasy";

export type Theme = "light" | "dark";
export type Language = "en" | "nl";

export interface SettingsModel {
	theme: Theme,
	setTheme: Action<SettingsModel, { theme: Theme }>,

	language: Language,
	setLanguage: Action<SettingsModel, { language: Language }>,
}

export const settingsImpl: SettingsModel = {
	theme: "light",
	setTheme: action((store, { theme }) => void (store.theme = theme)),

	language: "en",
	setLanguage: action((store, { language }) => void (store.language = language)),
};