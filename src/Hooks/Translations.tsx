import { useTranslation } from "react-i18next";


export function useSatisfactoryText() 
{
	const { t } = useTranslation("satisfactory");
	return t;
}

export function useDesignerText() 
{
	const { t } = useTranslation("designer");
	return t;
}
