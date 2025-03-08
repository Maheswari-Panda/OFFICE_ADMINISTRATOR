import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DocumentContext from "../context/document/documentContext";
import Button from "./Button";

const ReportGenerator = () => {
  const { fetchPdfReport, fetchExcelReport } = useContext(DocumentContext); // Using the context for report fetch functions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState("date");
  const [reportFormate,setReportFormate] = useState("pdf");

  const downloadPdf = async (startDate,endDate) => {
    try {
      setLoading(true);
      setError(null);

      const pdfUrl = await fetchPdfReport(startDate,endDate);
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

  const downloadExcel = async (startDate,endDate) => {
    try {
      setLoading(true);
      setError(null);

      const excelUrl = await fetchExcelReport(startDate,endDate);
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

  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null,
      startMonth: null,
      endMonth: null,
      startYear: null,
      endYear: null,
    },
    validationSchema: Yup.object().shape({
      startDate: Yup.date().nullable(),
      endDate: Yup.date()
        .nullable()
        .min(Yup.ref("startDate"), "End date must be after start date"),
    }),
    onSubmit: async(values) => {
      if(reportFormate==="pdf"){
        await downloadPdf(values.startDate,values.endDate);
      }
      else{
        await downloadExcel(values.startDate,values.endDate);
      }
    },
  });

  return (
    <div className="report-generator p-3 w-full">
      <h1 className="text-blue-500 font-bold text-2xl">Generate Report</h1>

      <div className="flex justify-center items-center">
        <form onSubmit={formik.handleSubmit} className="m-4">
            <div className="mb-4">
              <label className="block text-gray-700">Select Date Range:</label>
              <div className="flex gap-2">
                <DatePicker
                  selected={formik.values.startDate}
                  onChange={(date) => formik.setFieldValue("startDate", date)}
                  className="input input-bordered w-full"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="-- dd-mm-yyyy --"
                />
                <DatePicker
                  selected={formik.values.endDate}
                  onChange={(date) => formik.setFieldValue("endDate", date)}
                  className="input input-bordered w-full"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="-- dd-mm-yyyy --"
                />
              </div>
              {formik.errors.endDate && formik.touched.endDate && (
                <span className="text-red-500">{formik.errors.endDate}</span>
              )}
            </div>
          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              type="submit"
              text={loading ? "Downloading PDF..." : "Generate Pdf Report"}
              icon={<i className="fa-solid fa-file-pdf"></i>}
              onClick={() => setReportFormate("pdf")}
              color={"blue"}
              disabled={loading}
            />
            <Button
              type="submit"
              text={loading ? "Downloading Exl..." : "Export Excel Report"}
              icon={<i className="fas fa-file"></i>}
              onClick={() => setReportFormate("excel")}
              color={"blue"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportGenerator;
