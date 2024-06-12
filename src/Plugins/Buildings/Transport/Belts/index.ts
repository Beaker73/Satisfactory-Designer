import type { Plugin } from "@/Plugins";
import mk1Image from "./mk1.webp";
import mk2Image from "./mk2.webp";
import mk3Image from "./mk3.webp";
import mk4Image from "./mk4.webp";
import mk5Image from "./mk5.webp";


export default {

	data: {
		buildings: {
			belt: {
				name: "Conveyor Belt",
				description: "Used to move resources between buildings.",
				category: "transport",
				wikiPage: "Conveyor_Belts",
				image: mk1Image,
				variants: {
					mk1: {
						name: "Mk.1",
						description: "Transports up to 60 resources per minute. Used to move resources between buildings.",
						image: mk1Image,
						maxPerMinute: 60,
					},
					mk2: {
						name: "Mk.2",
						description: "Transports up to 120 resources per minute. Used to move resources between buildings.",
						image: mk2Image,
						maxPerMinute: 120,
					},
					mk3: {
						name: "Mk.3",
						description: "Transports up to 270 resources per minute. Used to move resources between buildings.",
						image: mk3Image,
						maxPerMinute: 270,
					},
					mk4: {
						name: "Mk.4",
						description: "Transports up to 480 resources per minute. Used to move resources between buildings.",
						image: mk4Image,
						maxPerMinute: 480,
					},
					mk5: {
						name: "Mk.5",
						description: "Transports up to 780 resources per minute. Used to move resources between buildings.",
						image: mk5Image,
						maxPerMinute: 780,
					},
				},
			},
		},
	},

} satisfies Plugin;