import * as XLSX from "xlsx";

/**
 * Downloads an Excel file from an array of student objects.
 * @param {Array<{ name: string, email: string, age: number }>} students
 * @param {string} filename - optional custom filename
 */
export function exportToExcel(students, filename) {
  const rows = students.map(({ name, email, age }) => ({
    Name:  name,
    Email: email,
    Age:   age,
  }));

  const worksheet  = XLSX.utils.json_to_sheet(rows);
  const workbook   = XLSX.utils.book_new();

  // Set column widths
  worksheet["!cols"] = [{ wch: 26 }, { wch: 34 }, { wch: 8 }];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  const date        = new Date().toISOString().slice(0, 10);
  const outputName  = filename || `students_${date}.xlsx`;

  XLSX.writeFile(workbook, outputName);
}
