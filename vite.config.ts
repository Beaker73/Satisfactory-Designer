import griffel from "@griffel/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
//import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	esbuild: {
		target: "es2022",
	},
	plugins: [
		react(),
		command === "build" && false && griffel(),
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
