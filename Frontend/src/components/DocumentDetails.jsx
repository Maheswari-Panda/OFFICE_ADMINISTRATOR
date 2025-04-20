import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
  use,
} from "react";
import Button from "./Button";
import DocumentContext from "../context/document/documentContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentViewer from "./DocumentViewer";
import userContext from "../context/user/userContext";
import Spinner from "./Spinner";

function DocumentDetails({ document }) {
  const location = useLocation();
  document = document || location.state?.document;
  // console.log(document.DocumentPath);

  const navigate = useNavigate();
  const documentContext = useContext(DocumentContext);
  const { user } = useContext(userContext);
  const signedInUserOfficeId = user.OfficeId;

  const [loading,setLoading]=useState(false);

  const [editMode, setEditMode] = useState(false);

  const [attachedDocumentPath, setAttachedDocumentPath] = useState("");

  const {
    documents,
    documentTypes,
    getAllDocumentType,
    users,
    getUsers,
    uploadDocument,
    updateDocument,
    getAttachedDocument,
    updateAttachedDocument,
    uploadAttachedDocument
  } = documentContext;
  useEffect(() => {
    getAllDocumentType();
    getUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attachedDoc = await Promise.all([
          getAttachedDocument(document.DocumentId),
        ]);
        if (attachedDoc && attachedDoc[0] !== undefined) {
          setAttachedDocumentPath(attachedDoc[0].AttachedDocumentPath);
        } else {
          setAttachedDocumentPath(null);
        }
      } catch (error) {
        console.error("Error fetching attached document:", error);
      }
    };

    fetchData();
  }, []);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState(1);
  const [attachedDocument, setAttachedDocument] = useState(null);
  const [attachedDocumentUploadState, setAttachedDocumentUploadState] =useState(0);
  const inputRef = useRef();

  const formik = useFormik({
    initialValues: {
      IsInward: document.IsInward,
      DocumentName: document.DocumentName,
      DocumentTypeId: document.DocumentTypeId,
      LetterSerialNumber: document.LetterSerialNumber,
      InwardOutwardReferenceDocumentId:
      document.InwardOutwardReferenceDocumentId,
      EndUserId: document.EndUserId,
      DocumentDescription: document.DocumentDescription,
      DocumentPath: document.DocumentPath,
      SenderId: document.SenderId,
      ReceiverId: document.ReceiverId,
      BillingInfo: document.BillingInfo,
      AttachedDocumentPath: attachedDocumentPath,
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
        setLoading(true);
        if ((uploadState===1 && values.AttachedDocumentPath==="") || (values.AttachedDocumentPath!=="" && uploadState === 1 && attachedDocumentUploadState === 1)) {
          console.log(Number(values.IsInward));
          const response = await updateDocument(
            document.DocumentId,
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
            document.OfficeId
          );
          console.log(response);
          console.log(response.message);
         
          if(values.AttachedDocumentPath!==""){
            const AttachedDocumentResponse = await updateAttachedDocument(document.DocumentId,values.AttachedDocumentPath);
            console.log(AttachedDocumentResponse);
            if (response !== null && AttachedDocumentResponse!==null) {
              setLoading(false);
              alert("Document updated successfully!");
            } else {
              setLoading(false);
              alert("error in updating document with attached document");
            }
          }
          if (response != null) {
              setLoading(false);
              console.log(response);
              alert("Document updated successfully!");
            } else {
              setLoading(false);
              alert("error in updating document without attached document");
            }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error updating document:", error);
        alert("Error updating Document");
      }
    },
  });

  const isInward = formik.values.IsInward === 1; // Assuming you have a field to check

  const filteredUsersForSender = users.filter((user) =>
    isInward
      ? user.OfficeId === signedInUserOfficeId
      : user.OfficeId !== signedInUserOfficeId
  );

  // Filtering users based on document type
  const filteredUsersForReceiver = users.filter((user) =>
    isInward
      ? user.OfficeId !== signedInUserOfficeId
      : user.OfficeId === signedInUserOfficeId
  );

  const getOfficeCode = (officeName) => {
    if (!officeName) return ""; // Handle cases where officeName might be empty
    return officeName
      .split(" ") // Split by spaces
      .map((word) => word.charAt(0).toUpperCase()) // Get first letter of each word and uppercase it
      .join(""); // Join them to form initials
  };

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
    let attachedDocumentUrl = attachedDocumentPath;
    console.log(attachedDocument);
    if (attachedDocument) {
      const formData = new FormData();
      formData.append("AttachedDocumentPath", attachedDocument);
      // console.log(file);
      const uploadResponse = await uploadAttachedDocument(formData);
      if (uploadResponse) {
        setAttachedDocumentUploadState(1); // Set uploadState to 1 after successful upload
        attachedDocumentUrl =
          `http://localhost:3000` + uploadResponse.AttachedDocumentPath;
        setAttachedDocumentPath(attachedDocumentUrl);
        formik.setFieldValue("AttachedDocumentPath", attachedDocumentUrl);
        console.log(attachedDocumentUrl);
        console.log("Attached Document updated successfully");
      }
    }
  };
  const handleBackClick = () => {
    if(user.Role.toLowerCase() ==="user"){
      navigate(-1);
    }
    else{
      navigate(-1);
    }
  };
  return (
    <>
    {loading && <Spinner/>}
    {!loading && <div className="flex flex-col md:flex-row gap-4 bg-blue-50 min-h-screen p-4 w-full overflow-scroll">
      {
        <button
          onClick={handleBackClick}
          className="absolute z-10 btn btn-sm bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      }
      <div
        className={`flex-1 border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer bg-white border-gray-300`}
      >
       {document && document.DocumentPath ? (
          <DocumentViewer
            DocPath={document.DocumentPath}
            attachedDocPath={attachedDocumentPath}
          />
        ) : (
          <p>No document available</p>
        )}
      </div>

      <form
        className="flex flex-col md:flex-row gap-4 bg-blue-50 min-h-screen lg:w-1/4 md:w-1/3 sm:w-full"
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
                  checked={!formik.values.IsInward} // ✅ Correctly bind checked state
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!editMode}
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
                  disabled={!editMode}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Serial Number
            </label>
            <input
              type="text"
              name="DocumentSerialNumber"
              id="documentSerialNumber"
              className="input-sm w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
              value={document.DocumentSerialNumber}
              readOnly
            />

            {formik.errors.LetterSerialNumber &&
              formik.touched.LetterSerialNumber && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.LetterSerialNumber}
                </div>
              )}
          </div>

          <div
            hidden={
              user.Role.toLowerCase() !== "user" ||
              document.StatusName !== "Rejected"
            }
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Document
            </label>
            <input
              type="file"
              multiple
              name="DocumentPath"
              id="DocumentPath"
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              onBlur={formik.handleBlur}
              onChange={(event) => {
                setFile(event.currentTarget.files[0]);
                setUploadState(0);
              }}
              disabled={!editMode}
              hidden={file !== null}
            />
            {file !== null && (
              <input
                className={`${
                  uploadState === 1 ? "text-center" : "hidden"
                }
                input input-sm w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition`}
                value={formik.values.DocumentPath}
              />
            )}
            {file !== null && (
              <div
                className={`${
                  uploadState === 0 ? "text-center" : "hidden"
                } flex gap-2 border border-gray-300 rounded-md p-2 justify-center items-center`}
              >
                <span className="text-sm">{file.name}</span>
                <div>
                  <button
                    className="btn btn-xs bg-red-500 text-white"
                    onClick={() => setFile(null)}
                  >
                    <i className="fa-solid fa-close text-white"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs bg-blue-500 text-white"
                    onClick={handleUpload}
                  >
                    <i className="fa-solid fa-arrow-up-from-bracket text-white"></i>
                  </button>
                </div>
              </div>
            )}
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
              readOnly={!editMode}
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
              readOnly={!editMode}
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
              disabled={!editMode}
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
              value={formik.values.LetterSerialNumber === null ? "" : formik.values.LetterSerialNumber}
              readOnly={!editMode}
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
              disabled={!editMode}
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
              disabled={!editMode}
            >
              {filteredUsersForSender.map((user, index) => {
                return (
                  <option value={user.UserId} key={`${user.UserId}-${index}`}>
                    {user.FirstName + " " + user.LastName + " - "}{" "}
                    {getOfficeCode(user.OfficeName)}
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
              disabled={!editMode}
            >
              {filteredUsersForReceiver.map((user, index) => {
                return (
                  <option value={user.UserId} key={`${user.UserId}-${index}`}>
                    {user.FirstName + " " + user.LastName + " - "}{" "}
                    {getOfficeCode(user.OfficeName)}
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
              disabled={!editMode}
            >
              {filteredUsersForReceiver.map((user, index) => {
                return (
                  <option value={user.UserId} key={`${user.UserId}-${index}`}>
                    {user.FirstName + " " + user.LastName + " - "}{" "}
                    {getOfficeCode(user.OfficeName)}
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
              readOnly={!editMode}
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

          {(user.Role === "admin" ||
            user.Role === "Admin" ||
            user.Role === "SuperAdmin" ||
            (user.Role.toLowerCase() === "user" &&
              document.StatusName === "Rejected")) && (
            <div className="flex justify-between mt-5 gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-200">
                <i
                  className={`fas fa-edit text-${
                    !editMode ? "blue" : "gray"
                  }-500 rounded-full hover:text-${
                    !editMode ? "blue" : "gray"
                  }-600`}
                  title="toggle edit mode"
                  onClick={() => setEditMode(!editMode)}
                ></i>
              </div>
              <button
                type="submit"
                disabled={!editMode}
                // disabled={uploadState !== 1}
                className="btn btn-base bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
              >
                Update Document Details
              </button>
              {/* <Button color="blue" text="Save Document" /> */}
            </div>
          )}
        </div>
      </form>
    </div>
    }
    </>
  );
}

export default DocumentDetails;
