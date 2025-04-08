import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DocumentContext from "../context/document/documentContext";
import userContext from "../context/user/userContext";
import Button from "./Button";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const ReportGenerator = () => {
  const { fetchPdfReport, fetchExcelReport } = useContext(DocumentContext);
  const { user, addUserLog } = useContext(userContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportFormate, setReportFormate] = useState("pdf");
  const [previewDocs, setPreviewDocs] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const downloadPdf = async (startDate, endDate, preview = true) => {
    try {
      setLoading(true);
      setError(null);

      const pdfUrl = await fetchPdfReport(startDate, endDate);
      if (pdfUrl) {
        await addUserLog(user.UserId, "Report Generated");

        if (preview) {
          const timestamp = new Date().getTime();
          setPreviewDocs([
            {
              uri: pdfUrl,
              fileType: "pdf",
              name: `Preview_Report_${timestamp}.pdf`,
            },
          ]);
          setShowPreview(true);
        } else {
          const a = document.createElement("a");
          a.href = pdfUrl;
          a.download = "Documents_Report.pdf";
          a.click();
          window.URL.revokeObjectURL(pdfUrl);
        }
      }
    } catch (err) {
      setError("Error downloading PDF report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const excelUrl = await fetchExcelReport(startDate, endDate);
       if (excelUrl) {
        await addUserLog(user.UserId, "Report Generated");
        const a = document.createElement("a");
        a.href = excelUrl;
        a.download = "Documents_Report.xlsx";
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
    },
    validationSchema: Yup.object().shape({
      startDate: Yup.date().nullable().required("Start date is required"),
      endDate: Yup.date()
        .nullable()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
    }),
    onSubmit: async (values) => {
      if (reportFormate === "pdf") {
        await downloadPdf(values.startDate, values.endDate);
      } else {
        await downloadExcel(values.startDate, values.endDate);
      }
    },
  });

  return (
    <div className="report-generator p-3 w-full bg-blue-100 min-h-screen">
      <h1 className="text-blue-500 font-bold text-2xl mb-4">Generate Report</h1>

      <div className="flex justify-center items-center">
        <form onSubmit={formik.handleSubmit} className="m-4 bg-white p-5 rounded-md shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Select Date Range:</label>
            <div className="flex gap-2">
              <DatePicker
                selected={formik.values.startDate}
                onChange={(date) => formik.setFieldValue("startDate", date)}
                className="input input-bordered w-full"
                dateFormat="dd-MM-yyyy"
                placeholderText="📅 DD/MM/YYYY"
                required
              />
              <DatePicker
                selected={formik.values.endDate}
                onChange={(date) => formik.setFieldValue("endDate", date)}
                className="input input-bordered w-full"
                dateFormat="dd-MM-yyyy"
                placeholderText="📅 DD/MM/YYYY"
                required
              />
            </div>
            {formik.errors.endDate && formik.touched.endDate && (
              <span className="text-red-500">{formik.errors.endDate}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              type="submit"
              text={loading ? "Downloading PDF..." : "Generate PDF Report"}
              icon={<i className="fa-solid fa-file-pdf"></i>}
              onClick={() => setReportFormate("pdf")}
              color="blue"
              disabled={loading}
            />

            <Button
              type="submit"
              text={loading ? "Downloading Excel..." : "Export Excel Report"}
              icon={<i className="fas fa-file-excel"></i>}
              onClick={() => setReportFormate("excel")}
              color="blue"
              disabled={loading}
            />

          </div>
        </form>
      </div>

      {/* PDF Preview */}
      {showPreview && previewDocs.length > 0 && (
        <div className="mt-5 bg-white p-4 rounded shadow-md mx-auto max-w-4xl overflow-scroll">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-blue-600">Preview Report</h2>
            <Button
              text="Close Preview"
              onClick={() => {
                setShowPreview(false);
                setPreviewDocs([]);
              }}
              color="red"
            />
          </div>
          <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={previewDocs}
            key={JSON.stringify(previewDocs)}
            config={{ header: { disableHeader: true } }}
            style={{ height: "70vh" }}
          />
        </div>
      )}
      {!(previewDocs.length > 0) &&
      <div className="mt-5 bg-white p-4 rounded shadow-md mx-auto max-w-4xl overflow-scroll text-center">
        Generated pdf report will be shown here...
      </div>
      }
    </div>
  );
};

export default ReportGenerator;
