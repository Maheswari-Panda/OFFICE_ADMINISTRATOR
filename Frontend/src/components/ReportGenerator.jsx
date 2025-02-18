import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document/documentContext";
import Button from "./Button";

// Define your component
const ReportGenerator = () => {
  const { fetchPdfReport, fetchExcelReport } = useContext(DocumentContext); // Using the context for report fetch functions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadPdf = async () => {
    try {
      setLoading(true);
      setError(null);

      const pdfUrl = await fetchPdfReport();
      if (pdfUrl) {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = "Documents_Report.pdf"; // Set your file name here
        a.click();
        window.URL.revokeObjectURL(pdfUrl);
      }
    } catch (err) {
      setError("Error downloading PDF report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      setLoading(true);
      setError(null);

      const excelUrl = await fetchExcelReport();
      if (excelUrl) {
        const a = document.createElement("a");
        a.href = excelUrl;
        a.download = "Documents_Report.xlsx"; // Set your file name here
        a.click();
        window.URL.revokeObjectURL(excelUrl);
      }
    } catch (err) {
      setError("Error downloading Excel report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-generator p-3">
      <h1 className="text-blue-500 font-bold">Generate Report</h1>

      {error && <div className="error">{error}</div>}

      <div className="flex gap-2">
        <Button
          text={loading ? "Downloading PDF..." : "Generate Pdf Report"}
          icon={<i className="fa-solid fa-file-pdf"></i>}
          onClick={downloadPdf}
          color={"blue"}
          disabled={loading}
        />

        <Button
          text={loading ? "Downloading Exl..." : "Export Excel Report"}
          icon={<i className="fas fa-file"></i>}
          onClick={downloadExcel}
          color={"blue"}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ReportGenerator;
