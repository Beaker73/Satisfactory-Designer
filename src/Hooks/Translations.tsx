import type { DesignerResourceKey, ResourceKey } from "@/Data/Languages/Model";
import type { PropsWithChildren } from "react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useStoreState } from "@/Store";
import { initTranslation } from "../Data/Languages";

export function useSatisfactoryText() 
{
	const { t } = useTranslation("satisfactory");
	return useCallback<(key: ResourceKey) => string>(key => t(key), [t]);
}

export function useDesignerText() 
{
	const { t } = useTranslation("designer");
	return useCallback<(key: DesignerResourceKey) => string>(key => t(key), [t]);
}

export function TranslationProvider(props: PropsWithChildren<object>) 
{
	const [isTranslationAvailable, setTranslationAvailable] = useState(false);

	useEffect(() => 
	{
		initTranslation()
			.then(() => setTranslationAvailable(true))
			.catch(_x => {/** */});
	}, [setTranslationAvailable]);

	const language = useStoreState(state => state.settings.language);

	const { i18n, ready } = useTranslation();
	console.debug("i18next: app state", { i18n, ready, language });
	
	useEffect(() => 
	{
		if(ready)
			i18n.changeLanguage(language);
	}, [i18n, language, ready]);


	return <Suspense>
		{isTranslationAvailable && props.children};
	</Suspense>;
}