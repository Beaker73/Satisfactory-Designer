import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/satisfactory-designer", // path on github.io
	resolve: {
		alias: [
			{ find: "@", replacement: path.resolve(__dirname, "src") },
		],
	},
	test: {
		environment: "jsdom",
	},
});
