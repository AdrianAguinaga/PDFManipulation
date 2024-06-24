const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function removeFirstPage(inputPath, outputPath) {
  try {
    // Leer el archivo PDF
    const existingPdfBytes = fs.readFileSync(inputPath);

    // Cargar el documento PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Obtener el número de páginas
    const numPages = pdfDoc.getPageCount();

    // Si el documento tiene más de una página, eliminar la primera página
    if (numPages > 1) {
      // Crear un nuevo documento PDF
      const newPdfDoc = await PDFDocument.create();
      
      // Copiar todas las páginas excepto la primera
      for (let i = 1; i < numPages; i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);
      }

      // Guardar el nuevo documento PDF
      const newPdfBytes = await newPdfDoc.save();
      fs.writeFileSync(outputPath, newPdfBytes);
      console.log(`Nuevo PDF guardado en: ${outputPath}`);
    } else {
      console.log('El archivo PDF tiene una sola página. No se puede eliminar la primera página.');
    }
  } catch (error) {
    console.error('Error al procesar el archivo PDF:', error);
  }
}

// Ruta del archivo PDF de entrada y salida
const inputPath = "C:\\Users\\nefer\\Downloads\\Final\\OK 942 Urias Herrera.pdf";
const outputPath = "C:\\Users\\nefer\\Downloads\\Final\\modificados\\OK 942 Urias Herrera.pdf";

// Llamar a la función para eliminar la primera página
removeFirstPage(inputPath, outputPath);
