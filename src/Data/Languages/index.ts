import type { BackendModule, ResourceKey, TFunction } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let initResult: Promise<TFunction> | undefined;

export function initTranslation(getNamespace: (language: string, namespace: string) => ResourceKey ) 
{
	if(initResult)
		return initResult;

	const backend: BackendModule = {
		type: "backend",
		init: function(services, backendOptions, i18nextoptions) 
		{
			console.debug("translation: backend: init", { services, backendOptions, i18nextoptions });
		},
		read: (language, namespace, callback) => 
		{
			const data = getNamespace(language, namespace); 
			callback(null, data);
		},
	};

	initResult = i18n
		.use(backend)
		.use(initReactI18next)
		.init({
			fallbackLng: "en",
			fallbackNS: "designer",
			load: "currentOnly",
			debug: true,
			interpolation: {
				escapeValue: false, // react already safes from xss
			},
		});

	return initResult;
}