// src/utils/excelExporter.ts
import * as XLSX from "xlsx";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
const exportToExcel = (data: any[], filePath: string) => {
	const wb = XLSX.utils.book_new();
	const ws = XLSX.utils.json_to_sheet(data);
	XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
	XLSX.writeFile(wb, filePath);
};

export default exportToExcel;
