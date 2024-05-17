import type { PropsWithChildren } from "react";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { initTranslation } from "@/Data/Languages";
import { } from "@/Hooks/Translations";
import { useStoreState } from "@/Store";

import { Loading } from "./Loading";



export function TranslationProvider(props: PropsWithChildren) 
{
	const [isTranslationAvailable, setTranslationAvailable] = useState(false);

	useEffect(() => 
	{
		initTranslation()
			.then(() => setTranslationAvailable(true))
			.catch(_x => {/** */ });
	}, [setTranslationAvailable]);

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
