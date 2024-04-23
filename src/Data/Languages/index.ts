import type { Resource, ResourceLanguage } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { dutch } from "./Dutch";
import { english } from "./English";

const resources: Resource = {
	en: english as unknown as ResourceLanguage,
	nl: dutch as unknown as ResourceLanguage,
};

console.debug("i18n: resources", { resources });

export function initTranslation() 
{
	return i18n
		.use(initReactI18next)
		.init({
			resources,
			fallbackLng: "en",
			debug: true,
			interpolation: {
				escapeValue: false, // react already safes from xss
			},
		});
}