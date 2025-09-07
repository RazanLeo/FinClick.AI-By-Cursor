import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { parseFinancialText } from './parsers/text-parser';
import { extractTablesFromPDF } from './parsers/pdf-parser';
import { processExcelData } from './parsers/excel-parser';

export async function extractFinancialData(
  content: Buffer,
  mimeType: string,
  filename: string
) {
  try {
    let extractedData = null;

    // Handle different file types
    if (mimeType.includes('pdf')) {
      extractedData = await extractFromPDF(content);
    } else if (
      mimeType.includes('spreadsheet') || 
      mimeType.includes('excel') ||
      filename.endsWith('.xlsx') ||
      filename.endsWith('.xls')
    ) {
      extractedData = await extractFromExcel(content);
    } else if (
      mimeType.includes('word') ||
      filename.endsWith('.docx') ||
      filename.endsWith('.doc')
    ) {
      extractedData = await extractFromWord(content);
    } else if (mimeType.includes('image')) {
      extractedData = await extractFromImage(content);
    } else {
      // Try to parse as text
      const text = content.toString('utf-8');
      extractedData = await parseFinancialText(text);
    }

    // Enhance with AI if needed
    if (extractedData && extractedData.needsEnhancement) {
      extractedData = await enhanceWithAI(extractedData);
    }

    return extractedData;
  } catch (error) {
    console.error('Extraction error:', error);
    throw new Error(`فشل في استخراج البيانات من ${filename}`);
  }
}

async function extractFromPDF(content: Buffer) {
  try {
    const pdfDoc = await PDFDocument.load(content);
    const pages = pdfDoc.getPages();
    
    let fullText = '';
    const tables = [];
    
    // Extract text from each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // Extract text content
      const pageText = await extractTextFromPDFPage(page);
      fullText += pageText + '\n';
      
      // Extract tables if present
      const pageTables = await extractTablesFromPDF(page);
      tables.push(...pageTables);
    }
    
    // Parse the extracted content
    const parsedData = await parseFinancialText(fullText);
    
    // Merge table data
    if (tables.length > 0) {
      parsedData.tables = tables;
      parsedData.hasStructuredData = true;
    }
    
    return parsedData;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw error;
  }
}

async function extractFromExcel(content: Buffer) {
  try {
    const workbook = XLSX.read(content, {
      cellStyles: true,
      cellFormulas: true,
      cellDates: true,
      cellNF: true,
      sheetStubs: true,
    });
    
    const extractedSheets = {};
    
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        dateNF: 'yyyy-mm-dd',
      });
      
      // Process and structure the data
      const processedData = await processExcelData(jsonData, sheetName);
      extractedSheets[sheetName] = processedData;
    }
    
    return {
      type: detectStatementType(extractedSheets),
      sheets: extractedSheets,
      metadata: extractWorkbookMetadata(workbook),
      hasStructuredData: true,
    };
  } catch (error) {
    console.error('Excel extraction error:', error);
    throw error;
  }
}

async function extractFromWord(content: Buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: content });
    const text = result.value;
    
    // Also try to extract tables
    const tablesResult = await mammoth.convertToHtml({ buffer: content });
    const html = tablesResult.value;
    
    // Parse tables from HTML
    const tables = extractTablesFromHTML(html);
    
    // Parse the text content
    const parsedData = await parseFinancialText(text);
    
    if (tables.length > 0) {
      parsedData.tables = tables;
      parsedData.hasStructuredData = true;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Word extraction error:', error);
    throw error;
  }
}

async function extractFromImage(content: Buffer) {
  try {
    // Use OCR to extract text
    const { data: { text } } = await Tesseract.recognize(
      content,
      'ara+eng', // Arabic and English
      {
        logger: m => console.log(m),
      }
    );
    
    // Parse the OCR text
    const parsedData = await parseFinancialText(text);
    parsedData.isOCR = true;
    parsedData.needsEnhancement = true;
    
    return parsedData;
  } catch (error) {
    console.error('Image OCR error:', error);
    throw error;
  }
}

async function extractTextFromPDFPage(page: any) {
  // Implementation for extracting text from PDF page
  // This would use pdf-lib or another PDF parsing library
  return '';
}

function extractTablesFromHTML(html: string) {
  const tables = [];
  // Parse HTML and extract table data
  const tableRegex = /<table[^>]*>(.*?)<\/table>/gs;
  const matches = html.matchAll(tableRegex);
  
  for (const match of matches) {
    const tableHTML = match[1];
    const tableData = parseHTMLTable(tableHTML);
    if (tableData) {
      tables.push(tableData);
    }
  }
  
  return tables;
}

function parseHTMLTable(tableHTML: string) {
  const rows = [];
  const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
  const cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/gs;
  
  const rowMatches = tableHTML.matchAll(rowRegex);
  
  for (const rowMatch of rowMatches) {
    const rowHTML = rowMatch[1];
    const cells = [];
    const cellMatches = rowHTML.matchAll(cellRegex);
    
    for (const cellMatch of cellMatches) {
      const cellContent = cellMatch[1]
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .trim();
      cells.push(cellContent);
    }
    
    if (cells.length > 0) {
      rows.push(cells);
    }
  }
  
  return rows.length > 0 ? rows : null;
}

function detectStatementType(sheets: any) {
  // Detect the type of financial statement based on content
  const sheetNames = Object.keys(sheets).join(' ').toLowerCase();
  const firstSheetData = Object.values(sheets)[0] as any;
  
  if (sheetNames.includes('balance') || sheetNames.includes('مركز')) {
    return 'balance_sheet';
  } else if (sheetNames.includes('income') || sheetNames.includes('دخل')) {
    return 'income_statement';
  } else if (sheetNames.includes('cash') || sheetNames.includes('نقد')) {
    return 'cash_flow';
  } else if (sheetNames.includes('trial') || sheetNames.includes('ميزان')) {
    return 'trial_balance';
  }
  
  // Try to detect from content
  if (firstSheetData && firstSheetData.headers) {
    const headers = firstSheetData.headers.join(' ').toLowerCase();
    if (headers.includes('assets') || headers.includes('أصول')) {
      return 'balance_sheet';
    } else if (headers.includes('revenue') || headers.includes('إيرادات')) {
      return 'income_statement';
    }
  }
  
  return 'unknown';
}

function extractWorkbookMetadata(workbook: XLSX.WorkBook) {
  return {
    sheetCount: workbook.SheetNames.length,
    sheetNames: workbook.SheetNames,
    properties: workbook.Props || {},
    customProperties: workbook.Custprops || {},
  };
}

async function enhanceWithAI(data: any) {
  // Enhance extracted data using AI
  // This would connect to OpenAI or other AI services
  return data;
}
