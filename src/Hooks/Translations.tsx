import type { DesignerResourceKey, ResourceKey } from "@/Data/Languages/Model";
import type { PropsWithChildren } from "react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Loading } from "@/Components/Loading";
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
