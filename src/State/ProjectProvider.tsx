import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import type { ProjectProviderProps } from ".";
import { projectContext } from ".";


export function ProjectProvider(props: PropsWithChildren<ProjectProviderProps>) 
{
	const { state, dispatch } = props;

	const ProjectContext = projectContext.Provider;
	const context = useMemo(() => ({ state, dispatch }), [state, dispatch]);

	return <ProjectContext value={context}>
		{props.children}
	</ProjectContext>;
}
