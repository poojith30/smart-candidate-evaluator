import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker using ESM URL
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    console.warn('Could not initialize local PDF worker, using fallback worker URL', e);
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
}

/**
 * Extracts raw textual content from a PDF File or ArrayBuffer.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      disableFontFace: false,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items into line chunks
      const pageStrings = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .filter((str) => str.trim().length > 0);

      pageTexts.push(pageStrings.join(' '));
    }

    const fullText = pageTexts.join('\n\n');
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Return graceful fallback message
    return `[PDF Text Extraction Error: ${(error as Error).message}]`;
  }
}
