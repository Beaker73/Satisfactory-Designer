import type { Computed } from "easy-peasy";
import { action, computed, type Action } from "easy-peasy";
import type { ResourceKeys } from "i18next";


import type { Translation } from "../Model/Translation";


export interface TranslationsModel {
	// translations grouped by language/namespace/key
	translations: Record<string, Record<string, Record<string, Translation>>>,

	/** Get a translation for a language, in a namespace, by it's key */
	get: Computed<TranslationsModel, (language: string, namespace: string, key: string) => (string | undefined)>,
	getNamespace: Computed<TranslationsModel, (language: string, namespace: string) => ResourceKeys>,

	importTranslations: Action<TranslationsModel, {translations: Translation[]}>,
}

export const translationsImpl: TranslationsModel = {
	translations: {},

	get: computed(state => (language, namespace, key) => state.translations[language]?.[namespace]?.[key]?.text),
	getNamespace: computed(state => (language, namespace) => 
	{
		const input = state.translations[language]?.[namespace];
		const output = input ? Object.fromEntries(
			Object.entries(input)
				.map(([key, item]) => [key, item?.text]),
		) : undefined;
		return output as ResourceKeys;
	}),

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