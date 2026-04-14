// scripts/extract-css.js
import { glob } from "glob";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const distPath = path.resolve(process.cwd(), "dist");
const srcPath = path.resolve(process.cwd(), "src");
const importsRegex = /@import\s+['"][^'"]+['"];\s*/g;
// 1. Компилируем каждый SCSS файл отдельно через CLI
const scssFiles = glob.sync("src/blocks/**/*.scss", { absolute: true });

for (const scssFile of scssFiles) {
    // Определяем выходной путь в dist
    const relativePath = path.relative(srcPath, scssFile);
    const blockOutputPath = path.join(
        `${distPath}/src`,
        relativePath.replace(".scss", ".css"),
    );
    const outputDir = path.dirname(blockOutputPath);
    console.log("outpu====", outputDir);
    // Создаём директорию
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Компилируем SCSS в CSS
    try {
        execSync(
            `npx sass "${scssFile}" "${blockOutputPath}" --no-source-map --style=expanded`,
        );
        console.log(`✅ Compiled: ${relativePath} → ${blockOutputPath}`);
    } catch (error) {
        console.error(`❌ Error compiling ${scssFile}:`, error.message);
    }
}

// 2. Собираем main.css (глобальные стили без импортов)
const mainScssPath = path.join(srcPath, "main.scss");
const mainCssPath = path.join(`${distPath}/src`, "main.css");
let scssImports = [];
if (fs.existsSync(mainScssPath)) {
    // Временно убираем импорты из main.scss
    let mainContent = fs.readFileSync(mainScssPath, "utf8");
    scssImports = getSCSSImports(mainContent);
    const globalStyles = mainContent.replace(importsRegex, "");

    console.log("scssImports---", scssImports);
    // Компилируем глобальные стили
    const tempScss = path.join(`${distPath}/src`, "_temp_main.scss");
    fs.writeFileSync(tempScss, globalStyles);
    execSync(
        `npx sass "${tempScss}" "${mainCssPath}" --no-source-map --style=expanded`,
    );
    fs.unlinkSync(tempScss);

    if (scssImports.length) {
        let cssContent = "";
        for (let path of scssImports) {
            cssContent += `@import url('${path.cssPath}');\n`;
        }
        let content = fs.readFileSync(mainCssPath, "utf8");
        content = content.replace('@charset "UTF-8";', "");
        cssContent += content;
        console.log("css file====", mainCssPath);
        // console.log(JSON.stringify(cssContent));
        fs.writeFileSync(mainCssPath, cssContent);
    }

    console.log(`✅ Compiled: main.scss → main.css`);
}

console.log("✅ CSS extraction complete");

function getSCSSImports(mainScssContent) {
    let match;
    const scssImports = [];
    const importsRegex = /@import\s+["']([^"']+)["']\s*;?/g;
    while ((match = importsRegex.exec(mainScssContent)) !== null) {
        let importPath = match[1];
        // Обрабатываем разные форматы путей
        let cssPath = null;

        // Пути вида './blocks/header/header.scss'
        if (
            importPath.startsWith("./blocks/") &&
            importPath.endsWith(".scss")
        ) {
            cssPath = importPath
                .replace(/^\.\//, "")
                .replace(/\.scss$/, ".css");
        }
        // Пути вида 'blocks/header/header.scss'
        else if (
            importPath.startsWith("blocks/") &&
            importPath.endsWith(".scss")
        ) {
            cssPath = importPath.replace(/\.scss$/, ".css");
        }
        // Пути вида './blocks/header/header' (без .scss)
        else if (
            importPath.startsWith("./blocks/") &&
            !importPath.endsWith(".scss")
        ) {
            cssPath = `${importPath}.css`;
        }
        // Пути вида 'blocks/header/header' (без .scss)
        else if (
            importPath.startsWith("blocks/") &&
            !importPath.endsWith(".scss")
        ) {
            cssPath = `${importPath}.css`;
        }

        if (cssPath) {
            scssImports.push({
                original: importPath,
                cssPath: cssPath,
                blockName: cssPath.split("/")[1], // header, button и т.д.
            });
        }
    }
    return scssImports;
}
