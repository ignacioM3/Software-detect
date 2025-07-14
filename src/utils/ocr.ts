import Tesseract from 'tesseract.js';

export async function extractNumbersFromImage(imagePath: string): Promise<number[]> {
  try {
    
    const dataURL = await window.electronAPI.readImageBase64(imagePath);
    
    if (!dataURL || typeof dataURL !== 'string') {
      console.error('No se pudo leer la imagen como base64:', dataURL);
      return [];
    }

    if (!dataURL.startsWith('data:image/')) {
      console.error('El dataURL no tiene el formato correcto:', dataURL.substring(0, 50) + '...');
      return [];
    }

    
    const result = await Tesseract.recognize(dataURL, 'eng', {
      logger: m => console.log('OCR Progress:', m)
    });

    console.log('OCR completado, texto extraído:', result.data.text);

    const rawText = result.data.text;
    const matches = rawText.match(/[\d]+\.\d+/g);

    if (!matches) {
      console.log('No se encontraron números decimales en el texto');
      return [];
    }

    const numbers = matches.map(Number);
    console.log('Números encontrados:', numbers);
    
    return numbers;
  } catch (error) {
    console.error('Error al procesar la imagen con OCR:', error);
    return [];
  }
}
