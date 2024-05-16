import type { Computed } from "easy-peasy";
import { action, computed, type Action } from "easy-peasy";
import type { Translation } from "../Model/Translation";

export interface TranslationsModel {
	// translations grouped by language/namespace/key
	translations: Record<string, Record<string, Record<string, Translation>>>,
	get: Computed<TranslationsModel, (language: string, namespace: string, key: string) => (string | undefined)>,
	importTranslations: Action<TranslationsModel, {translations: Translation[]}>,
}

export const translationsImpl: TranslationsModel = {
	translations: {},

	get: computed(state => (language, namespace, key) => state.translations[language]?.[namespace]?.[key]?.text),

	importTranslations: action((state, { translations }) => 
	{
		for(const translation of translations) 
		{
			const { language, namespace, key } = translation;
			
			if(!(language in state.translations))
				state.translations[language] = {};
			const namespaces = state.translations[language];

			if(!(namespace in namespaces))
				namespaces[namespace] = {};
			const keys = namespaces[namespace];

			keys[key] = translation;
		}
	}),
};