const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function addFirstPage(inputPath, newPagePath, outputPath) {
  try {
    // Leer el archivo PDF existente
    const existingPdfBytes = fs.readFileSync(inputPath);
    // Leer el archivo PDF que contiene la nueva primera página
    const newPagePdfBytes = fs.readFileSync(newPagePath);

    // Cargar los documentos PDF
    const existingPdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPagePdfDoc = await PDFDocument.load(newPagePdfBytes);

    // Crear un nuevo documento PDF
    const newPdfDoc = await PDFDocument.create();

    // Copiar la nueva primera página
    const [newFirstPage] = await newPdfDoc.copyPages(newPagePdfDoc, [0]);
    newPdfDoc.addPage(newFirstPage);

    // Copiar todas las páginas del documento existente
    const numPages = existingPdfDoc.getPageCount();
    for (let i = 0; i < numPages; i++) {
      const [copiedPage] = await newPdfDoc.copyPages(existingPdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);
    }

    // Guardar el nuevo documento PDF
    const newPdfBytes = await newPdfDoc.save();
    fs.writeFileSync(outputPath, newPdfBytes);
    console.log(`Nuevo PDF guardado en: ${outputPath}`);
  } catch (error) {
    console.error('Error al procesar el archivo PDF:', error);
  }
}

// Rutas de los archivos PDF de entrada y salida
const inputPath = "C:\\Users\\nefer\\Downloads\\Final\\modificados\\942\\ok 942 Garcia Estrada.pdf";
const newPagePath = "C:\\Users\\nefer\\Downloads\\Final\\modificados\\pPagina942\\942.pdf";
const outputPath = "C:\\Users\\nefer\\Downloads\\Final\\modificados\\modificadosNP\\ok 942 Garcia Estrada.pdf";

// Llamar a la función para agregar la nueva primera página
addFirstPage(inputPath, newPagePath, outputPath);
