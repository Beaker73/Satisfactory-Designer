import type { Plugin } from "@/Plugins";

export default {

	data: {
		buildings: {
			splitter: {
				name: "Splitter",
				category: "logistics",
				inputs: 1,
				outputs: 3,
			},
		},
	},

} satisfies Plugin;