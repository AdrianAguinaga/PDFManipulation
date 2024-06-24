const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function addLastPageToAllPdfs(inputFolderPath, newPagePath, outputFolderPath) {
  // Leer el archivo PDF que contiene las nuevas últimas páginas
  const newPagePdfBytes = fs.readFileSync(newPagePath);
  const newPagePdfDoc = await PDFDocument.load(newPagePdfBytes);

  // Leer todos los archivos en la carpeta de entrada
  const files = fs.readdirSync(inputFolderPath);

  for (const file of files) {
    const inputFilePath = path.join(inputFolderPath, file);
    const outputFilePath = path.join(outputFolderPath, file);

    if (path.extname(file).toLowerCase() === '.pdf') {
      try {
        // Leer el archivo PDF existente
        const existingPdfBytes = fs.readFileSync(inputFilePath);
        
        // Cargar el documento PDF existente
        const existingPdfDoc = await PDFDocument.load(existingPdfBytes);

        // Crear un nuevo documento PDF
        const newPdfDoc = await PDFDocument.create();

        // Copiar todas las páginas del documento existente
        const numPages = existingPdfDoc.getPageCount();
        for (let i = 0; i < numPages; i++) {
          const [copiedPage] = await newPdfDoc.copyPages(existingPdfDoc, [i]);
          newPdfDoc.addPage(copiedPage);
        }

        // Copiar y añadir todas las páginas del nuevo documento PDF
        const numNewPages = newPagePdfDoc.getPageCount();
        for (let i = 0; i < numNewPages; i++) {
          const [copiedNewPage] = await newPdfDoc.copyPages(newPagePdfDoc, [i]);
          newPdfDoc.addPage(copiedNewPage);
        }

        // Guardar el nuevo documento PDF
        const newPdfBytes = await newPdfDoc.save();
        fs.writeFileSync(outputFilePath, newPdfBytes);
        console.log(`Nuevo PDF guardado en: ${outputFilePath}`);
      } catch (error) {
        console.error(`Error al procesar el archivo ${file}:`, error);
      }
    }
  }
}

// Rutas de las carpetas de entrada y salida, y del archivo PDF de la nueva última página
const inputFolderPath = "C:\\Users\\nefer\\Downloads\\Final\\modificadosNP\\";
const newPagePath = "C:\\Users\\nefer\\Downloads\\Final\\ultimahoja942\\942 DEspuyes del examen.pdf";
const outputFolderPath = "C:\\Users\\nefer\\Downloads\\Final\\ModificadosFinal942\\";

// Asegurarse de que la carpeta de salida exista
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath, { recursive: true });
}

// Llamar a la función para agregar la nueva última página a todos los archivos PDF en la carpeta de entrada
addLastPageToAllPdfs(inputFolderPath, newPagePath, outputFolderPath);
