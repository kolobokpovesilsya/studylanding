// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import fs from "fs";

export default defineConfig({
    //  base: './',
    build: {
        outDir: "docs",
        target: "esnext",
        emptyOutDir: true,
        minify: false,
        cssCodeSplit: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                // SCSS файлы блоков
                // ...Object.fromEntries(
                //     glob.sync("src/blocks/**/*.scss").map((file) => {
                //         // Убираем .scss, оставляем путь
                //         const name = file
                //             .replace(/\.scss$/, "")
                //             .replace(/\\/g, "/");
                //         return [name, resolve(__dirname, file)];
                //     }),
                // ),
                // main: resolve(__dirname, "src/main.scss"),
                // JS файлы блоков
                ...Object.fromEntries(
                    glob.sync("src/blocks/**/*.js").map((file) => {
                        const name = file
                            .replace(/\.js$/, "")
                            .replace(/\\/g, "/");
                        return [name, resolve(__dirname, file)];
                    }),
                ),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "src/main") {
                        return "main.js";
                    }
                    if (
                        chunkInfo.name.includes("blocks/") &&
                        !chunkInfo.name.endsWith(".scss")
                    ) {
                        return `${chunkInfo.name}.js`;
                    }
                    return "src/[name].js";
                },
                chunkFileNames: "src/[name].js",

                assetFileNames: (assetInfo) => {
                    const originalPath = assetInfo.originalFileName || "";
                    const fileName = assetInfo.name || "";
                    console.log("assetInfo", assetInfo.names);
                    // // CSS файлы
                    if (fileName.endsWith(".css")) {
                        // if (originalPath.includes("main.scss")) {
                        //     return "main.css";
                        // }
                        // const match = originalPath.match(
                        //     /src\/(blocks\/[^/]+\/[^/]+)\.scss/,
                        // );
                        // if (match) {
                        //     return `${match[1]}.css`;
                        // }
                        return "src/[name].css";
                    }

                    // Ассеты из папки src/assets
                    if (originalPath) {
                        // src/assets/header/logo.png → assets/header/logo.png
                        const assetMatch =
                            originalPath.match(/src\/assets\/(.+)/);
                        if (assetMatch) {
                            return `src/assets/${assetMatch[1]}`;
                        }
                    }

                    return "src/assets/[name].[ext]";
                },
            },
        },
        sourcemap: false,
        modulePreload: false,
        assetsInlineLimit: 0,
    },
    css: {
        preprocessorOptions: {
            scss: {
                // Опционально: добавляем алиас для удобства
                additionalData: `$assets-path: '/assets';\n`,
            },
        },
    },
    resolve: {
        alias: {
            // Алиас для удобного импорта ассетов
            "@assets": resolve(__dirname, "src/assets"),
        },
    },
    plugins: [],
    server: {
        watch: {
            usePolling: true,
        },
    },
});
