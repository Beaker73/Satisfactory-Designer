import type { BackendModule, ResourceKey, TFunction } from "i18next";
import i18next from "i18next";
import type { PropsWithChildren } from "react";
import { Suspense, useEffect, useState } from "react";
import { initReactI18next, useTranslation } from "react-i18next";

import { } from "@/Hooks/Translations";
import { useStoreState } from "@/Store";

import { Loading } from "./Loading";



export function TranslationProvider(props: PropsWithChildren) 
{
	const [isTranslationAvailable, setTranslationAvailable] = useState(false);
	const getNamespace = useStoreState(store => store.translations.getNamespace);

	useEffect(() => 
	{
		initTranslation(getNamespace)
			.then(() => setTranslationAvailable(true))
			.catch(_x => {/** */ });
	}, [setTranslationAvailable, getNamespace]);

	return <Suspense>
		{!isTranslationAvailable && <Loading message="Loading translations" />}
		{isTranslationAvailable && <LanguageSwitcher>{props.children}</LanguageSwitcher>}
	</Suspense>;
}

function LanguageSwitcher(props: PropsWithChildren) 
{
	const language = useStoreState(state => state.settings.language);
	const { i18n, ready } = useTranslation();
	useEffect(() => 
	{
		if (ready) 
			i18n.changeLanguage(language);
	}, [i18n, language, ready]);
	return props.children;
}


let initResult: Promise<TFunction> | undefined;

// eslint-disable-next-line react-refresh/only-export-components -- this function does not change very often. F5 is fine when this changes.
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

	initResult = i18next
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