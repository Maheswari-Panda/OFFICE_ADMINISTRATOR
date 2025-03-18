
import React, { useContext, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import DocumentContext from "../context/document/documentContext";
function CreateDocument() {
  const editor = useRef(null);
  const [content, setContent] = useState(`
    <div style="padding: 20px; margin: 20px; width: auto; max-width: 100%;">
      <div style="display: flex; align-items: center; justify-content:space-around; margin-bottom: 20px;">
        <img src="https://upload.wikimedia.org/wikipedia/en/b/bf/Msu_baroda_logo.png" alt="MSU LOGO" width="130" height="130" style="margin-right: 20px;">
        <div>
          <h2 style="text-align: right;"><strong style="font-family: &quot;Times New Roman&quot;, Times, serif;">THE MAHARAJA SAYAJIRAO UNIVERSITY OF BARODA</strong></h2>
          <h3 style="text-align: right;"><span style="font-family: &quot;Times New Roman&quot;, Times, serif;"><strong>COMPUTER CENTRE<br></strong></span>Pratapgunj, Msu Main Campus<br>Vadodara - 39001 (India)<br>Telephone No.&nbsp;0265-2795518</h3>
        </div>
      </div>
      <hr style="border: 1px solid #000;">
      <p style="text-align: justify; line-height: 1.6; margin-top: 20px;">
        Start Writing here...
      </p>
    </div>
`);
  
  const navigate = useNavigate();
  const {uploadDocument}=useContext(DocumentContext);
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
            navigate("/dashboard/addDocument", { state: { documentUrl: uploadedDocumentPath } });
        }
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload document");
    }
};

  return (
    <>
      <div className="w-full shadow-lg p-2 h-full bg-blue-100">
        <div className="w-full h-full bg-white p-2 rounded-lg border border-gray-300 shadow-lg">
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)
            }
          />
          <div className="flex justify-end">
            <Button
              text="Upload Document"
              color="blue"
              onClick={handleUploadDocument}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default CreateDocument;
