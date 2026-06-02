#!/usr/bin/env node

/**
 * Redimensiona una imagen de avatar (ej. generada con una IA a 1024x1024)
 * y la convierte a WebP para que ocupe mucho menos que el PNG original.
 *
 * Uso:
 *   node scripts/process-avatar.js <entrada> <salida.webp> [tamaño]
 *
 * Ejemplo:
 *   node scripts/process-avatar.js ~/Descargas/rana.png assets/avatares/rana.webp 300
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const [, , input, output, sizeArg] = process.argv;
const size = parseInt(sizeArg || "300", 10);

if (!input || !output) {
  console.error("Uso: node scripts/process-avatar.js <entrada> <salida.webp> [tamaño=300]");
  process.exit(1);
}

if (!fs.existsSync(input)) {
  console.error(`No existe el archivo de entrada: ${input}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(output), { recursive: true });

sharp(input)
  .resize(size, size, { fit: "cover" })
  .webp({ quality: 85 })
  .toFile(output)
  .then(() => {
    const before = fs.statSync(input).size;
    const after = fs.statSync(output).size;
    const kb = (n) => (n / 1024).toFixed(1) + "KB";
    console.log(`✅ ${output}`);
    console.log(`   ${kb(before)} → ${kb(after)} (${size}x${size})`);
  })
  .catch((err) => {
    console.error("Error procesando la imagen:", err);
    process.exit(1);
  });
