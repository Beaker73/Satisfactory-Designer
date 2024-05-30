import griffel from "@griffel/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
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
