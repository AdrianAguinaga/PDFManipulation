const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function addFirstPagesToAllPdfs(inputFolderPath, newPagesPath, outputFolderPath) {
  // Leer el archivo PDF que contiene las nuevas primeras páginas
  const newPagesPdfBytes = fs.readFileSync(newPagesPath);
  const newPagesPdfDoc = await PDFDocument.load(newPagesPdfBytes);

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

        // Copiar todas las páginas del nuevo documento PDF al principio
        const numNewPages = newPagesPdfDoc.getPageCount();
        for (let i = 0; i < numNewPages; i++) {
          const [newPage] = await newPdfDoc.copyPages(newPagesPdfDoc, [i]);
          newPdfDoc.addPage(newPage);
        }

        // Copiar todas las páginas del documento existente
        const numExistingPages = existingPdfDoc.getPageCount();
        for (let i = 0; i < numExistingPages; i++) {
          const [copiedPage] = await newPdfDoc.copyPages(existingPdfDoc, [i]);
          newPdfDoc.addPage(copiedPage);
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

// Rutas de las carpetas de entrada y salida, y del archivo PDF de las nuevas primeras páginas
const inputFolderPath = "C:\\Users\\nefer\\Downloads\\Final\\modificados\\942\\";
const newPagesPath = "C:\\Users\\nefer\\Downloads\\Final\\modificados\\pPagina942\\942.pdf";
const outputFolderPath = "C:\\Users\\nefer\\Downloads\\Final\\modificados\\modificadosNP\\";

// Asegurarse de que la carpeta de salida exista
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath, { recursive: true });
}

// Llamar a la función para agregar las nuevas primeras páginas a todos los archivos PDF en la carpeta de entrada
addFirstPagesToAllPdfs(inputFolderPath, newPagesPath, outputFolderPath);
