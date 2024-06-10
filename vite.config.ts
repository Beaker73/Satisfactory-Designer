import griffel from "@griffel/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		// https://github.com/vitejs/vite/issues/16616#issuecomment-2143102333
		react({
			babel: {
				plugins: [
					["@babel/plugin-proposal-decorators", { version: "2023-11" }],
				],
			},
			swcOptions: {
				jsc: {
					parser: {
						syntax: "typescript",
						tsx: true,
						decorators: true,
					},
					transform: {
						decoratorVersion: "2023-03",
					},
				},
			},
		}),
		command === "build" && false && griffel(),
		swc.vite({
			jsc: {
				parser: {
					syntax: "typescript",
					decorators: true,
				},
				transform: {
					decoratorMetadata: true,
					decoratorVersion: "2022-03",
					react: {
						runtime: "automatic",
					},
				},
			},
		}),
	],
	base: "/Satisfactory-Designer/", // path on github.io
	resolve: {
		alias: [
			{ find: "@", replacement: path.resolve(__dirname, "src") },
		],
	},
	test: {
		environment: "jsdom",
	},
}));
