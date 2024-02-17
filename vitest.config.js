import path from "path";
import { defineProject } from "vitest/config";

export default defineProject({
	test: {
		globals: true,
		environment: "node",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
