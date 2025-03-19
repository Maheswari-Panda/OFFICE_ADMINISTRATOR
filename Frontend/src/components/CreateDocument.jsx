import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import DocumentContext from "../context/document/documentContext";
import "../style/JoditEditor.css";
import userContext from "../context/user/userContext";

function CreateDocument() {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const { uploadDocument, getNextUpcomingOutwardDocumentSerialNumber,generateHTML2Pdf } =
    useContext(DocumentContext);
  const [outwardDocumentSerialNumber, setOutwardDocumentSerialNumber] =
    useState(null);

  const editor = useRef(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNextUpcomingOutwardDocumentSerialNumber(
          user.OfficeId
        );
        console.log(response[0].nextSerialNumber);
        if (response) {
          setOutwardDocumentSerialNumber(response[0].nextSerialNumber);
          setContent(`
            <div style="padding: 20px; margin: 20px; width: auto; max-width: 100%;">
              <div style="display: flex; align-items: center; justify-content:space-around; margin-bottom: 20px;">
                <img src="https://upload.wikimedia.org/wikipedia/en/b/bf/Msu_baroda_logo.png" alt="MSU LOGO" width="130" height="130" style="margin-right: 20px;">
                <div>
                  <p style="text-align: right;"><strong style="font-family: &quot;Times New Roman&quot;, Times, serif;">THE MAHARAJA SAYAJIRAO UNIVERSITY OF BARODA</strong></p>
                  <p style="text-align: right;"><span style="font-family: &quot;Times New Roman&quot;, Times, serif;"><strong>COMPUTER CENTRE<br></strong></span>Pratapgunj, Msu Main Campus<br>Vadodara - 39001 (India)<br>Telephone No.&nbsp;0265-2795518</p>
                </div>
              </div>
              <hr style="border: 1px solid #000;">
              <p style="text-align: justify; line-height: 1.6; margin-top: 20px;">
                ${response[0].nextSerialNumber}
              </p>
              <p style="text-align: justify; line-height: 1.6; margin-top: 20px;">
                Start Writing here...
              </p>
            </div>
        `);
        }
      } catch (error) {
        console.error(
          "Error fetching next outward document serial number :",
          error
        );
      }
    };
    fetchData();
  }, [user.OfficeId]);

  // console.log(content);
  const handleUploadDocument = async () => {
    if (!content.trim()) {
      alert("Document is empty!");
      return;
    }
    // Convert HTML content to a Blob file
    const blob = new Blob([content], { type: "text/html" });
    const file = new File([blob], "document.html", { type: "text/html" });
    const formData = new FormData();
    formData.append("DocumentPath", file);
    try {
      const uploadResponse = await uploadDocument(formData);
      if (uploadResponse) {
        const uploadedDocumentPath =
          `http://localhost:3000` + uploadResponse.DocumentPath;
        console.log("Uploaded URL:", uploadedDocumentPath);
        // Navigate to AddDocument page with the uploaded URL
        navigate("/dashboard/addDocument", {
          state: { documentUrl: uploadedDocumentPath },
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload document");
    }
  };

  const handleGenerateHtml2Pdf = async () => {
    const htmlContent = content; // This is coming from Jodit

    console.log(content);

    const response = await fetch(
      "http://localhost:3000/api/generatePdf/html2pdf",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent }),
      }
    );
      
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert("Failed to generate PDF");
    }
  };

  const handleGenerateAndUploadPdf = async () => {
    const htmlContent = content; // from Jodit
  
    const response = await fetch(
      "http://localhost:3000/api/generatePdf/html2pdf",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent }),
      }
    );
  
    if (response.ok) {
      const pdfBlob = await response.blob();
      const pdfFile = new File([pdfBlob], "document.pdf", {
        type: "application/pdf",
      });
  
      const formData = new FormData();
      formData.append("DocumentPath", pdfFile);
  
      try {
        const uploadResponse = await uploadDocument(formData);
        if (uploadResponse) {
          const uploadedDocumentPath =
            `http://localhost:3000` + uploadResponse.DocumentPath;
          console.log("Uploaded PDF URL:", uploadedDocumentPath);
  
          // Navigate to AddDocument page with uploaded PDF URL
          navigate("/dashboard/addDocument", {
            state: { documentUrl: uploadedDocumentPath },
          });
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload PDF");
      }
    } else {
      alert("Failed to generate PDF");
    }
  };
  

  return (
    <>
      <div className="w-full shadow-lg p-2 h-full bg-blue-100">
        <div className="w-full h-full bg-white p-2 rounded-lg border border-gray-300 shadow-lg">
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
          <div className="flex justify-end">
            <Button
              text="GeneratePdf"
              color="blue"
              onClick={handleGenerateHtml2Pdf}
            />
            <Button
              text="Upload Document"
              color="blue"
              onClick={handleGenerateAndUploadPdf}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default CreateDocument;
