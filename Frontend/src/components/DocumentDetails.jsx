import React, { useContext, useEffect, useRef, useState, useId } from "react";
import Button from "./Button";
import DocumentContext from "../context/document/documentContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentViewer from "./DocumentViewer";

function DocumentDetails({ document }) {
    const location= useLocation();
    document = (document===undefined)?location.state.document:document;
  
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
  } = documentContext;
  useEffect(() => {
    getAllDocumentType();
    getUsers();
  }, []);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState(1);
  const inputRef = useRef();
  const [formEditable,setFormEditable]= useState(0);

  const formik = useFormik({
    initialValues: {
      IsInward: document.IsInward,
      DocumentName: document.DocumentName,
      DocumentTypeId: document.DocumentTypeName,
      LetterSerialNumber: document.LetterSerialNumber,
      InwardOutwardReferenceDocumentId: document.InwardOutwardReferenceDocumentName,
      EndUserId: document.EndUserName,
      DocumentDescription: document.DocumentDescription,
      DocumentPath: document.DocumentPath,
      SenderId: document.SenderName,
      ReceiverId: document.ReceiverName,
      BillingInfo: document.BillingInfo,
      Feedback: "",
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
    onSubmit: async (values) => {
      console.log("clicked on submit");
      console.log(values);
      try {
        if (uploadState === 1) {
          values.DocumentPath = file;
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
            values.BillingInfo,
            values.Feedback,
            values.AttachedDocumentPath
          );
          console.log(response);
          if (response != null) {
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
  const handleBackClick=()=>{
    navigate("/dashboard/review");
  }
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-blue-50 min-h-screen p-4 w-full">
      <button
        onClick={handleBackClick}
        className="absolute z-10 btn btn-sm bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
        <div
          className={`flex-1 border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer bg-white border-gray-300`}
        >
          {/* <div className={`${uploadState === 0 ? "text-center" : "hidden"}`}>
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
          </div> */}

          {<DocumentViewer DocPath={document.DocumentPath} />}
        </div>

        <form
        className="flex flex-col md:flex-row gap-4 bg-blue-50 min-h-screen w-1/4"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(formik.errors);
          formik.handleSubmit();
        }}
      >
        <div className="flex-1 bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Document Details
          </h2>
          <div className="my-2 form-control">
            <div className="form-control">
              <label className="label cursor-pointer flex justify-between hover:bg-gray-100 rounded p-2">
                <span className="label-text">Inward</span>
                <input
                  type="radio"
                  name="IsInward"
                  value="0"
                  className="radio checked:text-blue-500"
                  checked={formik.values.IsInward} // ✅ Correctly bind checked state
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer flex justify-between hover:bg-gray-100 rounded p-2">
                <span className="label-text">Outward</span>
                <input
                  type="radio"
                  name="IsInward"
                  value="1"
                  className="radio checked:text-blue-500"
                  checked={formik.values.IsInward} // ✅ Correctly bind checked state
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled
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
            <label className="block text-sm font-medium text-gray-700 mb-2" hidden>
              Update Document
            </label>
            <input
              type="file"
              multiple
              name="DocumentPath"
              id="DocumentPath"
              onChange={(event) => setFile(event.currentTarget.files[0])}
              hidden
            />
            {formik.errors.DocumentPath && formik.touched.DocumentPath && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.DocumentPath}
              </div>
            )}
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
              readOnly
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
              rows="5"
              name="DocumentDescription"
              id="DocumentDescription"
              className="w-full input-sm rounded-md border border-gray-300 bg-gray-50 p-1 resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.DocumentDescription}
              readOnly
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
              className="p-2 input-sm w-full rounded-md border border-gray-300 bg-gray-50  focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              readOnly
              disabled
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
              Letter Srno.
            </label>
            <input
              type="text"
              name="LetterSerialNumber"
              id="latterNumber"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.LetterSerialNumber}
              readOnly
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
              className="p-2 input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.InwardOutwardReferenceDocumentId}
              disabled
              readOnly
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
              Sender
            </label>
            <select
              key={300}
              name="SenderId"
              id="SenderId"
              className="p-2 input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.SenderId}
              disabled
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
              Receiver
            </label>
            <select
              key={400}
              name="ReceiverId"
              id="ReceiverId"
              className="p-2 input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ReceiverId}
              disabled
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
              className="p-2 input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.EndUserId}
              disabled
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
              className="p-2 input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.BillingInfo}
              readOnly
            />

            {formik.errors.BillingInfo && formik.touched.BillingInfo && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.BillingInfo}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              rows="2"
              name="Feedback"
              id="Feedback"
              className="p-2 input-sm w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Feedback}
              readOnly
            ></textarea>

            {formik.errors.Feedback && formik.touched.Feedback && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.Feedback}
              </div>
            )}
          </div>

          <div hidden>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment
            </label>
            <input
              type="file"
              name="AttachedDocumentPath"
              id="AttachedDocumentPath"
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.AttachedDocumentPath}
              disabled
            />

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
              disabled
              // disabled={uploadState !== 1}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
            >
              Update Document
            </button>
            {/* <Button color="blue" text="Save Document" /> */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default DocumentDetails;
