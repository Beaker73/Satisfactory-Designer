export type Theme = "light" | "dark";

export interface SettingsModel {
	theme: Theme,
}

export const settingsImpl: SettingsModel = {
	theme: "light",
};