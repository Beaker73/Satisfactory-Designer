import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { DesignerResourceKey, ResourceKey } from "@/Data/Languages/Model";


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
