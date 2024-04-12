import { createStore, createTypedHooks, persist } from "easy-peasy";

import { projectsImpl, type ProjectsModel } from "./Projects";
import { settingsImpl, type SettingsModel } from "./Settings";

export interface StoreModel {
	settings: SettingsModel,
	projects: ProjectsModel,
}

const impl: StoreModel = {
	settings: persist(settingsImpl),
	projects: persist(projectsImpl),
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
