#!/usr/bin/env node

/**
 * Valida el contenido de src/data/*.json (los retos del juego).
 *
 * Comprueba:
 *  1) Textos duplicados exactos (mismo texto + genero + genero2).
 *  2) Retos sin mención de bebida ("o bebe X tragos"...), salvo los
 *     marcados "repetible": true, que son excepciones a propósito
 *     (ej. la prenda que hay que quitarse no tiene alternativa).
 *  3) Valores de genero/genero2 que no sean "hombre", "mujer" o "inter".
 *  4) Retos con genero2 pero cuyo texto no usa {player2}.
 *
 * Uso: node scripts/validate-retos.js
 */

const fs = require("fs");
const path = require("path");

const ARCHIVOS = ["src/data/hot.json", "src/data/fiesta.json"];
const PALABRA_BEBIDA = /trago|bebe|beben|copa|bebida/i;
const GENEROS_VALIDOS = ["hombre", "mujer", "inter"];

let totalAvisos = 0;

function avisar(archivo, mensaje) {
  console.log(`⚠️  [${archivo}] ${mensaje}`);
  totalAvisos++;
}

for (const archivo of ARCHIVOS) {
  const ruta = path.join(__dirname, "..", archivo);
  const retos = JSON.parse(fs.readFileSync(ruta, "utf8"));
  console.log(`\n${archivo}: ${retos.length} retos`);

  // 1) Duplicados exactos (mismo texto + misma combinación de género)
  const vistos = new Map();
  retos.forEach((r, i) => {
    const clave = `${r.texto.trim()}|${r.genero ?? ""}|${r.genero2 ?? ""}`;
    if (vistos.has(clave)) {
      avisar(
        archivo,
        `duplicado exacto en índices ${vistos.get(clave)} y ${i}: "${r.texto}"`
      );
    } else {
      vistos.set(clave, i);
    }
  });

  // 2) Sin alternativa de bebida (salvo repetible: true, que es a propósito)
  retos.forEach((r, i) => {
    if (!r.repetible && !PALABRA_BEBIDA.test(r.texto)) {
      avisar(
        archivo,
        `índice ${i} sin mención de bebida (¿falta "o bebe X tragos"?): "${r.texto}"`
      );
    }
  });

  // 3) genero / genero2 con valores no reconocidos
  retos.forEach((r, i) => {
    if (r.genero && !GENEROS_VALIDOS.includes(r.genero)) {
      avisar(archivo, `índice ${i} tiene genero inválido: "${r.genero}"`);
    }
    if (r.genero2 && !GENEROS_VALIDOS.includes(r.genero2)) {
      avisar(archivo, `índice ${i} tiene genero2 inválido: "${r.genero2}"`);
    }
  });

  // 4) genero2 sin {player2} en el texto (inconsistencia)
  retos.forEach((r, i) => {
    if (r.genero2 && !r.texto.includes("{player2}")) {
      avisar(
        archivo,
        `índice ${i} tiene genero2 pero el texto no usa {player2}: "${r.texto}"`
      );
    }
  });
}

console.log("");
if (totalAvisos === 0) {
  console.log("✅ Sin avisos.");
} else {
  console.log(`Total avisos: ${totalAvisos}`);
}
process.exit(totalAvisos > 0 ? 1 : 0);
