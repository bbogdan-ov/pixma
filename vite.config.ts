import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

export default defineConfig({
	base: "/pixma/",
    plugins: [
        tsconfigPaths(),
        checker({ typescript: true })
    ],
    server: {
        port: 3000
    }
})
