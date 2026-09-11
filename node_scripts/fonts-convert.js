/*
-----------------------------------------------------------------------------
Конвертация шрифтов TTF/OTF в WOFF и WOFF2

Использование:
  yarn run fonts:convert                     — обработать все *.ttf в src/assets/fonts
  yarn run fonts:convert path/to/font.ttf    — обработать конкретные файлы

По умолчанию пропускает файлы, у которых .woff/.woff2 уже существуют.
Флаг --force конвертирует заново.
Флаг --keep сохраняет исходный .ttf/.otf — без него исходник удаляется,
когда обе выходные версии (.woff и .woff2) существуют.

Зависимости:
- ttf2woff — TTF/OTF → WOFF (чистый JS)
- wawoff2  — TTF/OTF → WOFF2 (WASM-сборка компрессора Google woff2,
             не требует нативной компиляции — стабильно работает на Windows)
-----------------------------------------------------------------------------
*/

const fs = require("fs");
const path = require("path");
const ttf2woff = require("ttf2woff");
const wawoff2 = require("wawoff2");

const FONTS_DIR = path.resolve(__dirname, "../src/assets/fonts");
const SOURCE_EXTENSIONS = new Set([".ttf", ".otf"]);

const args = process.argv.slice(2);
const force = args.includes("--force");
const keepSource = args.includes("--keep");
const fileArgs = args.filter((arg) => !arg.startsWith("--"));

// Рекурсивно собирает файлы шрифтов из директории
function collectFonts(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) return collectFonts(fullPath);

    return SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
      ? [fullPath]
      : [];
  });
}

async function convertFont(filePath) {
  const { dir, name } = path.parse(filePath);
  const input = new Uint8Array(fs.readFileSync(filePath));

  const targets = [
    { ext: ".woff", run: () => Buffer.from(ttf2woff(input).buffer) },
    { ext: ".woff2", run: async () => Buffer.from(await wawoff2.compress(input)) },
  ];

  for (const target of targets) {
    const outputPath = path.join(dir, name + target.ext);

    if (!force && fs.existsSync(outputPath)) {
      console.log(`Пропуск (уже есть): ${path.relative(process.cwd(), outputPath)}`);
      continue;
    }

    const output = await target.run();
    fs.writeFileSync(outputPath, output);

    const before = (input.length / 1024).toFixed(1);
    const after = (output.length / 1024).toFixed(1);
    console.log(`OK: ${path.relative(process.cwd(), outputPath)} (${before} KB -> ${after} KB)`);
  }

  // Исходник больше не нужен: удаляем, только если обе версии на месте
  const woffPath = path.join(dir, name + ".woff");
  const woff2Path = path.join(dir, name + ".woff2");

  if (!keepSource && fs.existsSync(woffPath) && fs.existsSync(woff2Path)) {
    fs.unlinkSync(filePath);
    console.log(`Удалён исходник: ${path.relative(process.cwd(), filePath)}`);
  }
}

async function main() {
  const files = fileArgs.length > 0
    ? fileArgs.map((file) => path.resolve(file))
    : collectFonts(FONTS_DIR);

  if (files.length === 0) {
    console.log(`Файлы .ttf/.otf не найдены в ${FONTS_DIR}`);
    return;
  }

  for (const file of files) {
    try {
      await convertFont(file);
    } catch (error) {
      console.error(`Ошибка конвертации ${file}: ${error.message}`);
    }
  }
}

// Экспорт для переиспользования в fonts-get.js
module.exports = { convertFont, FONTS_DIR };

if (require.main === module) {
  main();
}
