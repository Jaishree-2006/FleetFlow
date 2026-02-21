import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportCSV(tableData, filename = 'export.csv') {
  const ws = utils.json_to_sheet(tableData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, filename);
}

export function exportPDF(tableData, columns, filename = 'export.pdf') {
  const doc = new jsPDF();
  doc.autoTable({ head: [columns], body: tableData.map(row => columns.map(col => row[col])) });
  doc.save(filename);
}

export function formatExportData(data, columns) {
  return data.map(item => {
    const formattedRow = {};
    columns.forEach(col => {
      formattedRow[col] = item[col] || '';
    });
    return formattedRow;
  });
}
