// scripts/extract-css.js (альтернативная версия - без временной папки)
import { glob } from "glob";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

const distPath = path.resolve(process.cwd(), "docs");
const srcPath = path.resolve(process.cwd(), "src");

// Функция для добавления импорта функций в содержимое файла
function addFunctionsImport(content, inputFile) {
    // Проверяем, есть ли уже импорт функций
    const hasFunctionsImport =
        content.match(/@import\s+['"]functions['"]/i) ||
        content.match(/@import\s+['"].*functions\.scss['"]/i);

    if (hasFunctionsImport) {
        return content;
    }

    const functionsPath = path.join(srcPath, "functions.scss");

    if (!fs.existsSync(functionsPath)) {
        return content;
    }

    // Определяем относительный путь от входного файла до functions.scss
    const inputDir = path.dirname(inputFile);
    let relativePathToFunctions = path.relative(inputDir, functionsPath);
    relativePathToFunctions = relativePathToFunctions.replace(/\\/g, "/");

    // Убираем расширение .scss для @import
    relativePathToFunctions = relativePathToFunctions.replace(/\.scss$/, "");

    // Добавляем импорт в начало файла
    return `@import "${relativePathToFunctions}";\n${content}`;
}

const scssFiles = glob.sync("src/blocks/**/*.scss", { absolute: true });

for (const filePath of scssFiles) {
    const relativePath = path.relative(srcPath, filePath);
    const outputPath = path.join(
        path.resolve(distPath, "src"),
        relativePath.replace(".scss", ".css"),
    );
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const tempFilePath = path.join(
        path.resolve(distPath, "src"),
        relativePath.replace(".scss", ".temp.scss"),
    );
    let content = fs.readFileSync(filePath).toString();
    if (!content.includes("functions.scss")) {
        content = `@import "functions.scss";\n${content}`;
    }
    fs.writeFileSync(tempFilePath, content);
    try {
        execSync(
            `npx sass "${tempFilePath}" "${outputPath}" --no-source-map --style=expanded --load-path="${srcPath}" `,
        );
        const transformedCss = fs.readFileSync(outputPath);
        const result = await postcss([autoprefixer]).process(transformedCss, {
            from: tempFilePath,
            to: outputPath,
        });
        fs.writeFileSync(outputPath, result.css);
        fs.unlinkSync(tempFilePath);
    } catch (error) {
        console.error(`Error compiling ${filePath}: ${error.message}`);
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    } finally {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
}

const mainScssPath = path.join(srcPath, "main.scss");
const mainWithoutBlocks = removeSCSSBlocksImports(mainScssPath);

const tempMainPath = path.join(distPath, "src", "main.temp.scss");
fs.writeFileSync(tempMainPath, mainWithoutBlocks);

const outputMainPath = path.join(distPath, "src", "main.css");
try {
    execSync(
        `npx sass "${tempMainPath}" "${outputMainPath}" --no-source-map --style=expanded --load-path="${srcPath}" `,
    );
    const transformedCss = fs.readFileSync(outputMainPath);
    const result = await postcss([autoprefixer]).process(transformedCss, {
        from: mainScssPath,
        to: outputMainPath,
    });

    fs.writeFileSync(outputMainPath, result.css);
    fs.unlinkSync(tempMainPath);
} catch (error) {
    console.error(`Error compiling ${mainScssPath}: ${error.message}`);
    if (fs.existsSync(tempMainPath)) fs.unlinkSync(tempMainPath);
} finally {
    if (fs.existsSync(tempMainPath)) {
        fs.unlinkSync(tempMainPath);
    }
}
addCSSBlockImports(outputMainPath);

function removeSCSSBlocksImports(mainPath) {
    let mainSCSSFile = fs.readFileSync(mainPath).toString();

    mainSCSSFile = mainSCSSFile.replace(
        /@import\s+["'](\.\/)?blocks\/[^"']+["'];?\s*/g,
        "",
    );
    return mainSCSSFile;
}
function addCSSBlockImports(mainPath) {
    try {
        let scssFile = fs.readFileSync(mainPath).toString();
        let imports = "";
        const scssFiles = glob.sync("src/blocks/**/*.scss", { absolute: true });
        for (let file of scssFiles) {
            const relative = path.relative(srcPath, file);
            const newInport = `@import url(\'${relative.replaceAll("\\", "/").replace("\.scss", "\.css")}\');`;
            imports += `${newInport}\n`;
        }
        scssFile += imports;
        fs.writeFileSync(mainPath, scssFile);
    } catch (e) {
        console.error("Fail to add css block imports", e);
    }
}
async function compileWithPrefixes(inputFile, outputFile, loadPaths = []) {
    const loadPathArgs = loadPaths.map((p) => `--load-path="${p}"`).join(" ");

    // Читаем и модифицируем содержимое файла
    let content = fs.readFileSync(inputFile, "utf8");
    content = addFunctionsImport(content, inputFile);

    // Создаем временный файл с модифицированным содержимым
    const tempInputFile = outputFile + ".input.temp.scss";
    fs.writeFileSync(tempInputFile, content);

    const tempFile = outputFile + ".temp.css";

    try {
        execSync(
            `npx sass "${tempInputFile}" "${tempFile}" --no-source-map --style=expanded ${loadPathArgs}`,
            { stdio: "pipe" },
        );

        const cssContent = fs.readFileSync(tempFile, "utf8");
        const result = await postcss([autoprefixer]).process(cssContent, {
            from: inputFile,
            to: outputFile,
        });

        fs.writeFileSync(outputFile, result.css);
        fs.unlinkSync(tempFile);

        return;
    } catch (error) {
        console.error(`Error compiling ${inputFile}: ${error.message}`);
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        return false;
    } finally {
        // Удаляем временный входной файл
        if (fs.existsSync(tempInputFile)) {
            fs.unlinkSync(tempInputFile);
        }
    }
}

console.log("  CSS extraction complete!");
