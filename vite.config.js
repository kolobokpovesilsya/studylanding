// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import fs from "fs";

export default defineConfig({
    build: {
        outDir: "dist",
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
                    return "[name].js";
                },
                chunkFileNames: "[name].js",

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
                        return "[name].css";
                    }

                    // Ассеты из папки src/assets
                    if (originalPath) {
                        // src/assets/header/logo.png → assets/header/logo.png
                        const assetMatch =
                            originalPath.match(/src\/assets\/(.+)/);
                        if (assetMatch) {
                            return `assets/${assetMatch[1]}`;
                        }
                    }

                    return "assets/[name].[ext]";
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
    plugins: [
        {
            name: "postprocess-build",
            async closeBundle() {
                const distPath = resolve(__dirname, "dist");

                // Обработка CSS и JS
                // await processMainCss(distPath);
                // await processMainJs(distPath);

                console.log("✅ Сборка завершена");
            },
        },
    ],
    server: {
        watch: {
            usePolling: true,
        },
    },
});

// Функция обработки main.css
async function processMainCss(distPath) {
    const mainCssPath = resolve(distPath, "main.css");

    if (!fs.existsSync(mainCssPath)) return;

    const cssFiles = glob.sync("dist/blocks/**/*.css", {
        cwd: resolve(__dirname),
        absolute: true,
    });

    let mainContent = fs.readFileSync(mainCssPath, "utf8");
    mainContent = mainContent.replace(/@import\s+["'].*?\.scss["'];\s*/g, "");

    let imports = "";
    console.log("file===", cssFiles);
    for (const file of cssFiles) {
        let relativePath = file.replace(distPath, "").replace(/^[\\/]/, "");
        relativePath = relativePath.replace(/\\/g, "/");
        imports += `@import "./${relativePath}";\n`;
    }

    const finalContent = `/* ============================================
   Глобальные стили проекта
   ============================================ */

${mainContent.trim()}

/* ============================================
   Импорты БЭМ-блоков
   ============================================ */

${imports}
`;

    fs.writeFileSync(mainCssPath, finalContent, "utf8");
    console.log(`✅ main.css обновлён (${cssFiles.length} импортов)`);
}

// Функция обработки main.js
async function processMainJs(distPath) {
    const mainJsPath = resolve(distPath, "main.js");
    if (!fs.existsSync(mainJsPath)) return;

    const jsFiles = glob.sync("dist/blocks/**/*.js", {
        cwd: resolve(__dirname),
        absolute: true,
    });

    let imports = "";
    let initCalls = "";

    for (const file of jsFiles) {
        let relativePath = file.replace(distPath, "").replace(/^[\\/]/, "");
        relativePath = relativePath.replace(/\\/g, "/");
        const blockName = relativePath.split("/")[1];
        imports += `import { init${capitalize(blockName)} } from "./${relativePath}";\n`;
        initCalls += `    init${capitalize(blockName)}();\n`;
    }

    const newMainContent = `/* ============================================
   Импорты БЭМ-блоков
   ============================================ */

${imports}

/* ============================================
   Инициализация
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
${initCalls}});
`;

    fs.writeFileSync(mainJsPath, newMainContent, "utf8");
    console.log(`✅ main.js обновлён (${jsFiles.length} импортов)`);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
