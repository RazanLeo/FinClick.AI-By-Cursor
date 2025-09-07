// src/lib/parsers/documentParser.ts

import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import Papa from 'papaparse';

export interface ExtractedFinancialData {
  balanceSheet: {
    assets: {
      currentAssets: number;
      cashAndCashEquivalents: number;
      accountsReceivable: number;
      inventory: number;
      otherCurrentAssets: number;
      totalCurrentAssets: number;
      propertyPlantEquipment: number;
      intangibleAssets: number;
      investments: number;
      otherNonCurrentAssets: number;
      totalNonCurrentAssets: number;
      totalAssets: number;
    };
    liabilities: {
      currentLiabilities: number;
      accountsPayable: number;
      shortTermDebt: number;
      otherCurrentLiabilities: number;
      totalCurrentLiabilities: number;
      longTermDebt: number;
      deferredTaxLiabilities: number;
      otherNonCurrentLiabilities: number;
      totalNonCurrentLiabilities: number;
      totalLiabilities: number;
    };
    equity: {
      commonStock: number;
      retainedEarnings: number;
      additionalPaidInCapital: number;
      treasuryStock: number;
      otherEquity: number;
      totalShareholdersEquity: number;
    };
  };
  incomeStatement: {
    revenue: number;
    costOfRevenue: number;
    grossProfit: number;
    operatingExpenses: number;
    sellingGeneralAdmin: number;
    researchDevelopment: number;
    depreciation: number;
    operatingIncome: number;
    interestExpense: number;
    otherIncome: number;
    incomeBeforeTax: number;
    incomeTaxExpense: number;
    netIncome: number;
    earningsPerShare: number;
    shares: number;
  };
  cashFlowStatement: {
    operating: {
      netIncome: number;
      depreciation: number;
      changesInWorkingCapital: number;
      accountsReceivableChange: number;
      inventoryChange: number;
      accountsPayableChange: number;
      otherOperating: number;
      totalOperatingCashFlow: number;
    };
    investing: {
      capitalExpenditures: number;
      acquisitions: number;
      investments: number;
      otherInvesting: number;
      totalInvestingCashFlow: number;
    };
    financing: {
      debtIssuance: number;
      debtRepayment: number;
      commonStockIssuance: number;
      commonStockRepurchase: number;
      dividendsPaid: number;
      otherFinancing: number;
      totalFinancingCashFlow: number;
    };
    netChangeInCash: number;
    beginningCash: number;
    endingCash: number;
  };
  metadata: {
    companyName: string;
    fiscalYear: number;
    fiscalPeriod: string;
    currency: string;
    auditor?: string;
    source: string;
  };
}

export async function extractFinancialData(files: File[]): Promise<ExtractedFinancialData[]> {
  const results: ExtractedFinancialData[] = [];

  for (const file of files) {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    let extractedData: ExtractedFinancialData | null = null;

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      extractedData = await extractFromPDF(file);
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.xlsx')
    ) {
      extractedData = await extractFromExcel(file);
    } else if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx')
    ) {
      extractedData = await extractFromWord(file);
    } else if (fileType.startsWith('image/')) {
      extractedData = await extractFromImage(file);
    } else if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      extractedData = await extractFromCSV(file);
    }

    if (extractedData) {
      results.push(extractedData);
    }
  }

  return results;
}

async function extractFromExcel(file: File): Promise<ExtractedFinancialData> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellStyles: true,
    cellFormulas: true,
    cellDates: true,
    cellNF: true,
    sheetStubs: true
  });

  // البحث عن الأوراق المالية
  const balanceSheetName = findSheetByKeywords(workbook, ['balance', 'مركز', 'ميزانية']);
  const incomeSheetName = findSheetByKeywords(workbook, ['income', 'دخل', 'أرباح']);
  const cashFlowSheetName = findSheetByKeywords(workbook, ['cash', 'نقدية', 'تدفقات']);

  const data: ExtractedFinancialData = initializeEmptyFinancialData();

  if (balanceSheetName) {
    const sheet = workbook.Sheets[balanceSheetName];
    extractBalanceSheetData(sheet, data);
  }

  if (incomeSheetName) {
    const sheet = workbook.Sheets[incomeSheetName];
    extractIncomeStatementData(sheet, data);
  }

  if (cashFlowSheetName) {
    const sheet = workbook.Sheets[cashFlowSheetName];
    extractCashFlowData(sheet, data);
  }

  return data;
}

async function extractFromPDF(file: File): Promise<ExtractedFinancialData> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return parseFinancialText(fullText);
}

async function extractFromImage(file: File): Promise<ExtractedFinancialData> {
  const worker = await createWorker();
  await worker.loadLanguage('eng+ara');
  await worker.initialize('eng+ara');

  const imageUrl = URL.createObjectURL(file);
  const { data: { text } } = await worker.recognize(imageUrl);
  await worker.terminate();

  return parseFinancialText(text);
}

async function extractFromCSV(file: File): Promise<ExtractedFinancialData> {
  const text = await file.text();
  const parsed = Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimitersToGuess: [',', '\t', '|', ';']
  });

  return parseCSVData(parsed.data);
}

async function extractFromWord(file: File): Promise<ExtractedFinancialData> {
  // استخدام mammoth أو مكتبة مشابهة لاستخراج النص من Word
  const arrayBuffer = await file.arrayBuffer();
  // هنا يتم استخدام مكتبة لتحويل Word إلى HTML أو نص
  const text = await extractTextFromWord(arrayBuffer);
  return parseFinancialText(text);
}

function parseFinancialText(text: string): ExtractedFinancialData {
  const data = initializeEmptyFinancialData();
  
  // استخدام التعبيرات النمطية والذكاء الاصطناعي لاستخراج البيانات
  const patterns = {
    revenue: /(?:revenue|إيرادات|مبيعات)[\s:]*([0-9,]+)/i,
    netIncome: /(?:net income|صافي الربح|الربح الصافي)[\s:]*([0-9,]+)/i,
    totalAssets: /(?:total assets|إجمالي الأصول|مجموع الأصول)[\s:]*([0-9,]+)/i,
    totalLiabilities: /(?:total liabilities|إجمالي الالتزامات|مجموع الخصوم)[\s:]*([0-9,]+)/i,
    cashFlow: /(?:operating cash flow|التدفق النقدي التشغيلي)[\s:]*([0-9,]+)/i,
    // المزيد من الأنماط...
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      assignValueToData(data, key, value);
    }
  }

  return data;
}

function initializeEmptyFinancialData(): ExtractedFinancialData {
  return {
    balanceSheet: {
      assets: {
        currentAssets: 0,
        cashAndCashEquivalents: 0,
        accountsReceivable: 0,
        inventory: 0,
        otherCurrentAssets: 0,
        totalCurrentAssets: 0,
        propertyPlantEquipment: 0,
        intangibleAssets: 0,
        investments: 0,
        otherNonCurrentAssets: 0,
        totalNonCurrentAssets: 0,
        totalAssets: 0
      },
      liabilities: {
        currentLiabilities: 0,
        accountsPayable: 0,
        shortTermDebt: 0,
        otherCurrentLiabilities: 0,
        totalCurrentLiabilities: 0,
        longTermDebt: 0,
        deferredTaxLiabilities: 0,
        otherNonCurrentLiabilities: 0,
        totalNonCurrentLiabilities: 0,
        totalLiabilities: 0
      },
      equity: {
        commonStock: 0,
        retainedEarnings: 0,
        additionalPaidInCapital: 0,
        treasuryStock: 0,
        otherEquity: 0,
        totalShareholdersEquity: 0
      }
    },
    incomeStatement: {
      revenue: 0,
      costOfRevenue: 0,
      grossProfit: 0,
      operatingExpenses: 0,
      sellingGeneralAdmin: 0,
      researchDevelopment: 0,
      depreciation: 0,
      operatingIncome: 0,
      interestExpense: 0,
      otherIncome: 0,
      incomeBeforeTax: 0,
      incomeTaxExpense: 0,
      netIncome: 0,
      earningsPerShare: 0,
      shares: 0
    },
    cashFlowStatement: {
      operating: {
        netIncome: 0,
        depreciation: 0,
        changesInWorkingCapital: 0,
        accountsReceivableChange: 0,
        inventoryChange: 0,
        accountsPayableChange: 0,
        otherOperating: 0,
        totalOperatingCashFlow: 0
      },
      investing: {
        capitalExpenditures: 0,
        acquisitions: 0,
        investments: 0,
        otherInvesting: 0,
        totalInvestingCashFlow: 0
      },
      financing: {
        debtIssuance: 0,
        debtRepayment: 0,
        commonStockIssuance: 0,
        commonStockRepurchase: 0,
        dividendsPaid: 0,
        otherFinancing: 0,
        totalFinancingCashFlow: 0
      },
      netChangeInCash: 0,
      beginningCash: 0,
      endingCash: 0
    },
    metadata: {
      companyName: '',
      fiscalYear: new Date().getFullYear(),
      fiscalPeriod: 'Annual',
      currency: 'SAR',
      source: 'Uploaded Document'
    }
  };
}

// دوال مساعدة إضافية
function findSheetByKeywords(workbook: XLSX.WorkBook, keywords: string[]): string | null {
  const sheetNames = workbook.SheetNames;
  
  for (const sheetName of sheetNames) {
    const lowerName = sheetName.toLowerCase();
    for (const keyword of keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return sheetName;
      }
    }
  }
  
  return null;
}

function extractBalanceSheetData(sheet: XLSX.WorkSheet, data: ExtractedFinancialData): void {
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  // البحث عن البيانات المالية في الجدول
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      
      if (typeof cell === 'string') {
        const lowerCell = cell.toLowerCase();
        
        // البحث عن الأصول
        if (lowerCell.includes('cash') || lowerCell.includes('نقد')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.assets.cashAndCashEquivalents = value;
        }
        
        if (lowerCell.includes('receivable') || lowerCell.includes('مدينون')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.assets.accountsReceivable = value;
        }
        
        if (lowerCell.includes('inventory') || lowerCell.includes('مخزون')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.assets.inventory = value;
        }
        
        if (lowerCell.includes('total assets') || lowerCell.includes('إجمالي الأصول')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.assets.totalAssets = value;
        }
        
        // البحث عن الخصوم
        if (lowerCell.includes('payable') || lowerCell.includes('دائنون')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.liabilities.accountsPayable = value;
        }
        
        if (lowerCell.includes('long term debt') || lowerCell.includes('قروض طويلة')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.liabilities.longTermDebt = value;
        }
        
        if (lowerCell.includes('total liabilities') || lowerCell.includes('إجمالي الخصوم')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.liabilities.totalLiabilities = value;
        }
        
        // البحث عن حقوق الملكية
        if (lowerCell.includes('retained earnings') || lowerCell.includes('أرباح محتجزة')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.equity.retainedEarnings = value;
        }
        
        if (lowerCell.includes('shareholders equity') || lowerCell.includes('حقوق المساهمين')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.balanceSheet.equity.totalShareholdersEquity = value;
        }
      }
    }
  }
  
  // حساب القيم المشتقة
  calculateDerivedValues(data);
}

function extractIncomeStatementData(sheet: XLSX.WorkSheet, data: ExtractedFinancialData): void {
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      
      if (typeof cell === 'string') {
        const lowerCell = cell.toLowerCase();
        
        if (lowerCell.includes('revenue') || lowerCell.includes('إيرادات') || lowerCell.includes('مبيعات')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.incomeStatement.revenue = value;
        }
        
        if (lowerCell.includes('cost of') || lowerCell.includes('تكلفة')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.incomeStatement.costOfRevenue = value;
        }
        
        if (lowerCell.includes('gross profit') || lowerCell.includes('مجمل الربح')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.incomeStatement.grossProfit = value;
        }
        
        if (lowerCell.includes('operating income') || lowerCell.includes('الربح التشغيلي')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.incomeStatement.operatingIncome = value;
        }
        
        if (lowerCell.includes('net income') || lowerCell.includes('صافي الربح')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.incomeStatement.netIncome = value;
        }
      }
    }
  }
}

function extractCashFlowData(sheet: XLSX.WorkSheet, data: ExtractedFinancialData): void {
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      
      if (typeof cell === 'string') {
        const lowerCell = cell.toLowerCase();
        
        if (lowerCell.includes('operating cash') || lowerCell.includes('تدفقات تشغيلية')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.cashFlowStatement.operating.totalOperatingCashFlow = value;
        }
        
        if (lowerCell.includes('investing cash') || lowerCell.includes('تدفقات استثمارية')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.cashFlowStatement.investing.totalInvestingCashFlow = value;
        }
        
        if (lowerCell.includes('financing cash') || lowerCell.includes('تدفقات تمويلية')) {
          const value = extractNumberFromRow(row, j);
          if (value) data.cashFlowStatement.financing.totalFinancingCashFlow = value;
        }
      }
    }
  }
}

function extractNumberFromRow(row: any[], startIndex: number): number | null {
  // البحث عن أول رقم بعد النص
  for (let i = startIndex + 1; i < row.length; i++) {
    const cell = row[i];
    
    if (typeof cell === 'number') {
      return cell;
    }
    
    if (typeof cell === 'string') {
      const cleaned = cell.replace(/[^\d.-]/g, '');
      const num = parseFloat(cleaned);
      
      if (!isNaN(num)) {
        return num;
      }
    }
  }
  
  return null;
}

function calculateDerivedValues(data: ExtractedFinancialData): void {
  const bs = data.balanceSheet;
  const is = data.incomeStatement;
  
  // حساب الأصول المتداولة الإجمالية
  if (!bs.assets.totalCurrentAssets) {
    bs.assets.totalCurrentAssets = 
      bs.assets.cashAndCashEquivalents +
      bs.assets.accountsReceivable +
      bs.assets.inventory +
      bs.assets.otherCurrentAssets;
  }
  
  // حساب الأصول غير المتداولة الإجمالية
  if (!bs.assets.totalNonCurrentAssets) {
    bs.assets.totalNonCurrentAssets = 
      bs.assets.propertyPlantEquipment +
      bs.assets.intangibleAssets +
      bs.assets.investments +
      bs.assets.otherNonCurrentAssets;
  }
  
  // حساب إجمالي الأصول
  if (!bs.assets.totalAssets) {
    bs.assets.totalAssets = 
      bs.assets.totalCurrentAssets +
      bs.assets.totalNonCurrentAssets;
  }
  
  // حساب الربح الإجمالي
  if (!is.grossProfit && is.revenue && is.costOfRevenue) {
    is.grossProfit = is.revenue - is.costOfRevenue;
  }
  
  // حساب حقوق الملكية
  if (!bs.equity.totalShareholdersEquity && bs.assets.totalAssets && bs.liabilities.totalLiabilities) {
    bs.equity.totalShareholdersEquity = 
      bs.assets.totalAssets - bs.liabilities.totalLiabilities;
  }
}

function parseCSVData(data: any[]): ExtractedFinancialData {
  const result = initializeEmptyFinancialData();
  
  // تحليل البيانات CSV
  for (const row of data) {
    for (const [key, value] of Object.entries(row)) {
      if (typeof key === 'string' && typeof value === 'number') {
        assignValueByKeyword(result, key, value);
      }
    }
  }
  
  return result;
}

function assignValueByKeyword(data: ExtractedFinancialData, keyword: string, value: number): void {
  const lowerKey = keyword.toLowerCase();
  
  // ربط الكلمات المفتاحية بالحقول المناسبة
  const mappings: { [key: string]: (data: ExtractedFinancialData, value: number) => void } = {
    'revenue': (d, v) => d.incomeStatement.revenue = v,
    'إيرادات': (d, v) => d.incomeStatement.revenue = v,
    'net income': (d, v) => d.incomeStatement.netIncome = v,
    'صافي الربح': (d, v) => d.incomeStatement.netIncome = v,
    'total assets': (d, v) => d.balanceSheet.assets.totalAssets = v,
    'إجمالي الأصول': (d, v) => d.balanceSheet.assets.totalAssets = v,
    'total liabilities': (d, v) => d.balanceSheet.liabilities.totalLiabilities = v,
    'إجمالي الخصوم': (d, v) => d.balanceSheet.liabilities.totalLiabilities = v,
    'cash': (d, v) => d.balanceSheet.assets.cashAndCashEquivalents = v,
    'نقد': (d, v) => d.balanceSheet.assets.cashAndCashEquivalents = v,
    // المزيد من التعيينات...
  };
  
  for (const [pattern, setter] of Object.entries(mappings)) {
    if (lowerKey.includes(pattern)) {
      setter(data, value);
      break;
    }
  }
}

function assignValueToData(data: ExtractedFinancialData, key: string, value: number): void {
  // تعيين القيم إلى الحقول المناسبة
  switch (key) {
    case 'revenue':
      data.incomeStatement.revenue = value;
      break;
    case 'netIncome':
      data.incomeStatement.netIncome = value;
      break;
    case 'totalAssets':
      data.balanceSheet.assets.totalAssets = value;
      break;
    case 'totalLiabilities':
      data.balanceSheet.liabilities.totalLiabilities = value;
      break;
    case 'cashFlow':
      data.cashFlowStatement.operating.totalOperatingCashFlow = value;
      break;
    // المزيد من الحالات...
  }
}

async function extractTextFromWord(arrayBuffer: ArrayBuffer): Promise<string> {
  // هنا يمكن استخدام مكتبة مثل mammoth
  // import mammoth from 'mammoth';
  // const result = await mammoth.extractRawText({ arrayBuffer });
  // return result.value;
  
  // مؤقتاً، نرجع نص فارغ
  return '';
}

export default {
  extractFinancialData,
  initializeEmptyFinancialData
};
