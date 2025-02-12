import React, { useContext, useEffect, useRef, useState, useId } from "react";
import Button from "./Button";
import DocumentContext from "../context/document/documentContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import DocumentViewer from "./DocumentViewer";

export default function AddDocument() {
  const navigate = useNavigate();
  const documentContext = useContext(DocumentContext);
  const {
    documents,
    documentTypes,
    getAllDocumentType,
    users,
    getUsers,
    uploadDocument,
    addDocument,
    uploadAttachedDocument,
    addAttachedDocument
  } = documentContext;
  useEffect(() => {
    getAllDocumentType();
    getUsers();
  }, []);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [attachedDocumentUrl, setAttachedDocumentUrl] = useState(null);
  const [attachedDocument, setAttachedDocument] = useState(null);
  const [uploadState, setUploadState] = useState(0);
  const [attachedDocumentUploadState, setAttachedDocumentUploadState] =
    useState(0);
  const inputRef = useRef();

  const formik = useFormik({
    initialValues: {
      IsInward: 0,
      DocumentName: "",
      DocumentTypeId: "",
      LetterSerialNumber: "",
      InwardOutwardReferenceDocumentId: "",
      EndUserId: "",
      DocumentDescription: "",
      DocumentPath: "",
      SenderId: "",
      ReceiverId: "",
      BillingInfo: "",
      AttachedDocumentPath: "",
    },
    validationSchema: Yup.object({
      DocumentPath: Yup.string().required("Document Url required"),
      IsInward: Yup.string().required(
        "Document Inward/Outward selection is required"
      ),
      DocumentName: Yup.string().required("Document Name is required"),
      DocumentDescription: Yup.string().required(
        "Document Description is required"
      ),
      DocumentTypeId: Yup.string().required("Document Type is required"),
      SenderId: Yup.string().required("SenderId is required"),
      ReceiverId: Yup.string().required("ReceiverId is required"),
    }),
    onSubmit: async (values) =>{
      console.log("clicked on submit");
      console.log(values);
      try {
        if (uploadState === 1 && attachedDocumentUploadState === 1) {
          values.DocumentPath = file;
          console.log(Number(values.IsInward));
          const response = await addDocument(
            values.IsInward,
            values.DocumentName,
            values.DocumentTypeId,
            values.LetterSerialNumber,
            values.InwardOutwardReferenceDocumentId,
            values.EndUserId,
            values.DocumentDescription,
            values.DocumentPath,
            values.SenderId,
            values.ReceiverId,
            values.BillingInfo
          );
          console.log(response);
          console.log(response.message);
         
          const AttachedDocumentResponse = await addAttachedDocument(response.message,values.AttachedDocumentPath);
          console.log(AttachedDocumentResponse);
          if (response != null && AttachedDocumentResponse!==null) {
            alert("Document added successfully!");
            navigate("/dashboard/content");
          } else {
            alert("error in document adding");
          }
        }
      } catch (error) {
        console.error("Error adding  user:", error);
        alert("Error adding Document");
      }
    },
  });

  const handleUpload = async () => {
    let uploadedDocumentPath = file;
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append("DocumentPath", file);
      // console.log(file);
      const uploadResponse = await uploadDocument(formData);

      if (uploadResponse) {
        setUploadState(1); // Set uploadState to 1 after successful upload
        uploadedDocumentPath =
          `http://localhost:3000` + uploadResponse.DocumentPath;
        setFile(uploadedDocumentPath);
        formik.setFieldValue("DocumentPath", uploadedDocumentPath);
      }
    }
  };

  const handleAttachedDocuments = async () => {
    let attachedDocumentPath = attachedDocumentUrl;
    console.log(attachedDocument);
    if (attachedDocument) {
      const formData = new FormData();
      formData.append("AttachedDocumentPath", attachedDocument);
      // console.log(file);
      const uploadResponse = await uploadAttachedDocument(formData);

      if (uploadResponse) {
        setAttachedDocumentUploadState(1); // Set uploadState to 1 after successful upload
        attachedDocumentPath =
          `http://localhost:3000` + uploadResponse.AttachedDocumentPath;
        setAttachedDocumentUrl(attachedDocumentPath);
        formik.setFieldValue("AttachedDocumentPath", attachedDocumentPath);
        console.log(attachedDocumentPath);
        console.log("Attached Document uploded successfully");
      }
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
    // console.log(event.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-blue-50 min-h-screen p-4 w-full">
      <form
        className="flex flex-col md:flex-row gap-4 bg-blue-50 min-h-screen p-4 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(formik.errors);
          formik.handleSubmit();
        }}
      >
        {/* Drag-and-Drop Container */}
        {file === null ? (
          <div
            className={`flex-1 border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer bg-white ${
              dragActive ? "border-blue-500" : "border-gray-300"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragEnter}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <p className="text-gray-500 text-center">
                Drag and drop files here or click to upload.
              </p>
              <button
                type="button"
                className="btn bg-blue-500 text-white"
                onClick={() => inputRef.current.click()}
                onChange={handleDrop}
              >
                Select file
              </button>
            </div>
            {formik.errors.DocumentPath && formik.touched.DocumentPath && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.DocumentPath}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex-1 border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer bg-white ${
              dragActive ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <div className={`${uploadState === 0 ? "text-center" : "hidden"}`}>
              <span>{file.name}</span>
              <div>
                <button
                  className="btn btn-sm bg-red-500 text-white"
                  onClick={() => setFile(null)}
                >
                  Cencel
                </button>
                <button
                  type="button"
                  className="btn btn-sm bg-blue-500 text-white"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
            </div>

            {uploadState === 1 && <DocumentViewer DocPath={file} />}
          </div>
        )}

        <div className="flex-1 bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Document Details
          </h2>
          <div className="flex justify-around my-2 form-control">
            <div className="form-control">
              <label className="label cursor-pointer hover:bg-gray-100 rounded p-2">
                <span className="label-text">Inward</span>
                <input
                  type="radio"
                  name="IsInward"
                  value={0}
                  className="radio checked:bg-blue-500"
                  checked={formik.values.IsInward === 0}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "IsInward",
                      parseInt(e.target.value, 10)
                    )
                  } // Convert value to number
                  onBlur={formik.handleBlur}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer hover:bg-gray-100 rounded p-2">
                <span className="label-text">Outward</span>
                <input
                  type="radio"
                  name="IsInward"
                  value={1}
                  className="radio checked:bg-blue-500"
                  checked={formik.values.IsInward === 1}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "IsInward",
                      parseInt(e.target.value, 10)
                    )
                  } // Convert value to number
                  onBlur={formik.handleBlur}
                />
              </label>
            </div>

            {formik.touched.IsInward && formik.errors.IsInward && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.IsInward}
              </div>
            )}
          </div>

          <div>
            <input
              type="file"
              multiple
              name="DocumentPath"
              id="DocumentPath"
              ref={inputRef}
              onChange={(event) => setFile(event.currentTarget.files[0])}
              hidden
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              type="text"
              name="DocumentName"
              id="DocumentName"
              className="input input-sm w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.DocumentName}
            />

            {formik.errors.DocumentName && formik.touched.DocumentName && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.DocumentName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Description
            </label>
            <textarea
              rows="3"
              name="DocumentDescription"
              id="DocumentDescription"
              className="w-full input-sm rounded-md border border-gray-300 bg-gray-50 p-1 resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.DocumentDescription}
            ></textarea>

            {formik.errors.DocumentDescription &&
              formik.touched.DocumentDescription && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.DocumentDescription}
                </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag (Document Type)
            </label>
            <select
              key={100}
              name="DocumentTypeId"
              id="DocumentTypeId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.DocumentTypeId}
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50  focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
            >
              {documentTypes.map((doctype, index) => {
                return (
                  <option
                    value={doctype.DocumentTypeId}
                    key={`${doctype.DocumentTypeId}-${index}`}
                  >
                    {doctype.DocumentTypeName}
                  </option>
                );
              })}
            </select>

            {formik.errors.DocumentTypeId && formik.touched.DocumentTypeId && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.DocumentTypeId}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Letter Number
            </label>
            <input
              type="text"
              name="LetterSerialNumber"
              id="latterNumber"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.LetterSerialNumber}
            />

            {formik.errors.LetterSerialNumber &&
              formik.touched.LetterSerialNumber && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.LetterSerialNumber}
                </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Document
            </label>
            <select
              key={200}
              name="InwardOutwardReferenceDocumentId"
              id="InwardOutwardReferenceDocumentId"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.InwardOutwardReferenceDocumentId}
            >
              {documents.map((document, index) => (
                <option
                  value={document.DocumentId}
                  key={`${document.DocumentId}-${index}`}
                >
                  {document.DocumentName}
                </option>
              ))}
            </select>

            {formik.errors.InwardOutwardReferenceDocumentId &&
              formik.touched.InwardOutwardReferenceDocumentId && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.InwardOutwardReferenceDocumentId}
                </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SenderId
            </label>
            <select
              key={300}
              name="SenderId"
              id="SenderId"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.SenderId}
            >
              {users.map((user, index) => {
                return (
                  <option value={user.UserId} key={`${user.UserId}-${index}`}>
                    {user.FirstName + " " + user.LastName}
                  </option>
                );
              })}
            </select>

            {formik.errors.SenderId && formik.touched.SenderId && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.SenderId}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ReceiverId
            </label>
            <select
              key={400}
              name="ReceiverId"
              id="ReceiverId"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ReceiverId}
            >
              {users.map((user, index) => {
                return (
                  <option value={user.UserId} key={`${user.UserId}-${index}`}>
                    {user.FirstName + " " + user.LastName}
                  </option>
                );
              })}
            </select>
            {formik.errors.ReceiverId && formik.touched.ReceiverId && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.ReceiverId}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Destination
            </label>
            <select
              key={500}
              name="EndUserId"
              id="EndUserId"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.EndUserId}
            >
              {users.map((user, index) => {
                return (
                  <option value={user.UserId} key={`${user.UserId}-${index}`}>
                    {user.FirstName + " " + user.LastName}
                  </option>
                );
              })}
            </select>

            {formik.errors.EndUserId && formik.touched.EndUserId && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.EndUserId}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Info
            </label>
            <input
              type="text"
              name="BillingInfo"
              id="BillingInfo"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.BillingInfo}
            />

            {formik.errors.BillingInfo && formik.touched.BillingInfo && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.BillingInfo}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment
            </label>
            {attachedDocument === null ? 
            (<input
              type="file"
              name="AttachedDocumentPath"
              id="AttachedDocumentPath"
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              multiple
              onChange={(event) => setAttachedDocument(event.currentTarget.files[0])}
              onBlur={formik.handleBlur}
            />)
            :(
              <div className={`${attachedDocumentUploadState === 0 ? "text-center" : "hidden"}`}>
              <span>{attachedDocument.name}</span>
              <div>
                <button
                  className="btn btn-sm bg-red-500 text-white"
                  onClick={() => setAttachedDocument(null)}
                >
                  Cencel
                </button>
                <button
                  type="button"
                  className="btn btn-sm bg-blue-500 text-white"
                  onClick={handleAttachedDocuments}
                >
                  Upload
                </button>
              </div>
            </div>
            )}

            {formik.errors.AttachedDocumentPath &&
              formik.touched.AttachedDocumentPath && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.AttachedDocumentPath}
                </div>
              )}
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="submit"
              // disabled={uploadState !== 1}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
            >
              Add Document
            </button>
            {/* <Button color="blue" text="Save Document" /> */}
          </div>
        </div>
      </form>
    </div>
  );
}
