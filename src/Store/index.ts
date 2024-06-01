import { createStore, createTypedHooks, persist } from "easy-peasy";

// eslint-disable-next-line import/no-cycle -- yes cycle, but no runtime issue (store in Projects is only used in lambda after everything is initialized)
import { projectsImpl, type ProjectsModel } from "./Projects";
import { settingsImpl, type SettingsModel } from "./Settings";
import type { TranslationsModel } from "./Translation";
import { translationsImpl } from "./Translation";

export interface StoreModel {
	settings: SettingsModel,
	projects: ProjectsModel,
	translations: TranslationsModel,
}

const impl: StoreModel = {
	settings: persist(settingsImpl, { storage: "localStorage" }),
	projects: persist(projectsImpl, { storage: "localStorage" }),
	translations: translationsImpl,
};

export const store = createStore(impl);

if (import.meta.env.DEV) 
{
	if (import.meta.hot) 
	{
		import.meta.hot.accept("./index", newModule => 
		{
			store.reconfigure(newModule?.model);
		});
	}
}

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
