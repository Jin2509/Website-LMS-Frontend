// Excel utilities - forwarding to CSV for better compatibility
import { exportToCSV, readCSVFile, createCSVTemplate } from './csvUtils';

export async function exportToExcel(
  data: Record<string, any>[],
  filename: string,
  sheetName?: string,
  columnWidths?: Record<string, number>
) {
  // Just forward to CSV export (ignore sheet name and column widths for CSV)
  return exportToCSV(data, filename);
}

export async function readExcelFile(file: File): Promise<any[][]> {
  return readCSVFile(file);
}

export async function createExcelTemplate(
  data: any[][],
  filename: string,
  sheetName?: string,
  columnWidths?: number[]
) {
  // Just forward to CSV template (ignore sheet name and column widths for CSV)
  return createCSVTemplate(data, filename);
}
