import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import OfficeContext from "../context/office/officeContext";
import Spinner from "./Spinner";
import ModalAlert from "./ModalAlert";

function AddOfficeForm() {
  const {addOffice}= useContext(OfficeContext);
  const [loading, setLoading] = useState(false);

   const modalRef = useRef();
      
      const [alertHeading, setAlertHeading] = useState("");
      const [alertDescription, setAlertDescription] = useState(null);
      const [alertBtnText2, setAlertBtnText2] = useState("");

  const formik = useFormik({
    initialValues: {
      OfficeName: "",
      OfficeLocation: "",
      OfficeContact: "",
    },
    validationSchema: Yup.object({
      OfficeName: Yup.string().required("Office Name is required"),
      OfficeLocation: Yup.string().required("OfficeLocation is required"),
      OfficeContact: Yup.string().required("OfficeContact is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
        console.log(values);
      try {
        // Step 2: Create User with Image URL
        const response = await addOffice(
          values.OfficeName,
          values.OfficeLocation,
          values.OfficeContact,
        );

        if(response){
            console.log(response);
            setAlertHeading("Office Added Successfully!");
            setAlertDescription("You can view the added office in all Office option on the sidebar");
            setAlertBtnText2("Ok");
            setTimeout(()=>{
              setLoading(false);
              modalRef.current.click();
;            },500);
        // alert("Office Added successfully!");
        resetForm();
        }
        else{
            
          setAlertHeading("Error Adding Office");
          setAlertDescription("Error adding office try again with correct inputs");
          setAlertBtnText2("Ok");
          setTimeout(()=>{
            setLoading(false);
            modalRef.current.click();
;            },500);
        // alert("Error in Adding office!");
        }
      } catch (error) {
        console.error("Error Adding Office:", error);
        alert("Error Adding Office");
      }
    },
  });

  return (
    <div className="flex items-start justify-center min-h-screen bg-blue-100 w-full">
      {!loading ? <div className="bg-white m-2 p-8 rounded-2xl shadow-md lg:w-1/2 sm:w-full">
        <h2 className="text-xl font-semibold text-start text-blue-500 mb-6">
          Add Office
        </h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          {/* Office Name */}
          <div className="relative">
            <input
              type="text"
              name="OfficeName"
              placeholder="Office Name"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.OfficeName}
              minLength={3}
            />
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fas fa-id-card"></i>
            </span>
            {formik.touched.OfficeName && formik.errors.OfficeName && (
              <p className="text-red-500 text-sm">{formik.errors.OfficeName}</p>
            )}
          </div>

           {/* Office Name */}
           <div className="relative">
            <input
              type="text"
              name="OfficeLocation"
              placeholder="Office Location"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.OfficeLocation}
              minLength={3}
            />
            <span className="absolute left-3 top-1 text-blue-500">
            <i className="fa-solid fa-location-dot"></i>
            </span>
            {formik.touched.OfficeLocation && formik.errors.OfficeLocation && (
              <p className="text-red-500 text-sm">{formik.errors.OfficeLocation}</p>
            )}
          </div>

           {/* Office Name */}
           <div className="relative">
            <input
              type="text"
              name="OfficeContact"
              placeholder="Office Contact"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.OfficeContact}
              minLength={3}
            />
            <span className="absolute left-3 top-1 text-blue-500">
            <i className="fa-solid fa-phone-volume"></i>
            </span>
            {formik.touched.OfficeContact && formik.errors.OfficeContact && (
              <p className="text-red-500 text-sm">{formik.errors.OfficeContact}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="input input-sm btn w-full text-white border-gray-300 bg-blue-500 hover:border-blue-600 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-0 focus:ring-blue-500 cursor-pointer"
          >
            Add Office
          </button>
        </form>
      </div> : (
        <Spinner/>
      )}
      <ModalAlert
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        btnText2={alertBtnText2}
      />
    </div>
  );
}

export default AddOfficeForm;
