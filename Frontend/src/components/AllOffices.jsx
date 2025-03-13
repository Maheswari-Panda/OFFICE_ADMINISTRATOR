import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import OfficeContext from "../context/office/officeContext";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "./Spinner";
import ModalAlert from "./ModalAlert";

function AllOffices() {
  const officeContext = useContext(OfficeContext);
  const {getAllOffices, updateOffice,deleteOffice } = officeContext;
  const [office, setOffice] = useState({});
  const editRef = useRef();
  const closeRef = useRef();
  const deleteRef=useRef();

  const [loading, setLoading] = useState(true);

  const modalRef = useRef();
  const [alertHeading, setAlertHeading] = useState("");
  const [alertDescription, setAlertDescription] = useState(null);
  const [alertBtnText2, setAlertBtnText2] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getAllOffices()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
       setTimeout(()=>{
        setLoading(false);
       },500);
      }
    };

    fetchData();
  }, []);

  
  const {offices} = officeContext;

  const handleView = async (row) => {
    setOffice(row);
    console.log("View clicked:", row);
    editRef.current.click();
  };

  const handleDeleteModal=async(row)=>{
    setOffice(row);
    console.log(row);
    deleteRef.current.click();
  }

  const handleDeleteOffice = async (officeId) => {
    console.log("View clicked:", officeId);
    const response = await deleteOffice(officeId);
    console.log(response);
    if(response){
        setAlertHeading("Office Deleted Successfully!");
        setAlertDescription("All the related information to thid office has been deleted!");
        setAlertBtnText2("Ok");
        modalRef.current.click();
        // alert("Office Deleted Successfully!");
        officeContext.setOffices((prevOffices) =>
            prevOffices.filter((office) => office.OfficeId !== officeId)
          );
    }else{
        setAlertHeading("Error Deleting Office");
        setAlertDescription("Something went wrong!");
        setAlertBtnText2("Ok");
        modalRef.current.click();
        // alert("Error Deleting Office");
    }
  };
  const columns = useMemo(
    () => [
      {
        name: "Office Id",
        selector: (row, index ) => index + 1,
        sortable: true,
      },
      {
        name: "CreatedAt",
        selector: (row) =>
          new Date(row?.CreatedAt).toLocaleDateString() || "N/A",
        sortable: true,
      },
      {
        name: "Office Name",
        selector: (row) => row?.OfficeName || "N/A",
        sortable: true,
      },
      {
        name: "Location",
        selector: (row) => row?.OfficeLocation || "N/A",
        sortable: true,
      },
      {
        name: "Contact",
        selector: (row) => row?.OfficeContact || "N/A",
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex space-x-2">
            <button
              className="p-1 text-blue-500 hover:text-blue-700"
              onClick={() => handleView(row)}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="p-1 text-red-500 hover:text-red-700"
              onClick={() => handleDeleteModal(row)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (office) {
      formik.setValues({
        OfficeId: office.OfficeId || "",
        OfficeName: office?.OfficeName || "",
        OfficeLocation: office?.OfficeLocation || "",
        OfficeContact: office?.OfficeContact || "",
      });
    }
  }, [office]); // Runs when 'office' state changes

  const formik = useFormik({
    initialValues: {
      OfficeId: office.OfficeId,
      OfficeName: office.OfficeName,
      OfficeLocation: office.OfficeLocation,
      OfficeContact: office.OfficeContact,
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
        const response = await updateOffice(
          values.OfficeId,
          values.OfficeName,
          values.OfficeLocation,
          values.OfficeContact
        );

        if (response) {
          console.log(response);
          closeRef.current.click();
          
          setAlertHeading("Office Updated Successfully!");
          setAlertDescription("All the related information to thid office has been updated!");
          setAlertBtnText2("Ok");
            setTimeout(()=>{
              setLoading(false);
              modalRef.current.click();
            },500);
            // alert("Office Updated successfully!");
            officeContext.setOffices((prevOffices) =>
              prevOffices.map((office) =>
                office.OfficeId === values.OfficeId ? { ...office, ...values } : office
              )
            );
          resetForm();
        } else {
          setAlertHeading("Error Updating Office!");
          setAlertDescription("Something went wrong!");
          setAlertBtnText2("Ok");
            setTimeout(()=>{
              setLoading(false);
              modalRef.current.click();
            },500);
          // alert("Error in Updating office!");
        }
      } catch (error) {
        setAlertHeading("Error Updating Office!");
          setAlertDescription(error);
          setAlertBtnText2("Ok");
            setTimeout(()=>{
              setLoading(false);
              modalRef.current.click();
            },500);
        console.error("Error Updating Office:", error);
        // alert("Error Updating Office");
      }
    },
  });

  return (
    <div className="w-full flex justify-center bg-blue-100 min-h-screen">
      <div className="w-full bg-white p-6 m-2 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">All Offices</h2>

        {loading ? (
          <Spinner/>
        ) : offices.length === 0 ? (
          <div className="text-center text-gray-500 font-bold text-xl">
            No Offices Found
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={offices[0]}
            fixedHeader
            highlightOnHover
          />
        )}
      </div>

      <button
        className="btn hidden"
        onClick={() => document.getElementById("my_modal_5").showModal()}
        ref={editRef}
      >
        open modal
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
        <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" ref={closeRef}>✕</button>
    </form>
          <h2 className="text-xl font-semibold text-start text-blue-500 mb-6">
            Update Office
          </h2>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <input
                type="text"
                name="OfficeId"
                placeholder="Office Id"
                className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.OfficeId}
                hidden
              />
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
                <p className="text-red-500 text-sm">
                  {formik.errors.OfficeName}
                </p>
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
              {formik.touched.OfficeLocation &&
                formik.errors.OfficeLocation && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.OfficeLocation}
                  </p>
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
                <p className="text-red-500 text-sm">
                  {formik.errors.OfficeContact}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-sm input input-sm w-full text-white border-gray-300 bg-blue-500 hover:border-blue-600 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-0 focus:ring-blue-500"
            >
              Update Office
            </button>
          </form>
         
        </div>
      </dialog>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn hidden" onClick={()=>document.getElementById('my_modal_6').showModal()} ref={deleteRef}>open modal</button>
<dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg text-blue-500">Delete Office</h3>
    <p className="py-4">Are sure you want to delete this office once it gets deleted the related data to this office will get deleted also and you cannot retrive it.</p>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm bg-red-500 text-white mx-2 hover:bg-red-600 cursor-pointer" onClick={()=>handleDeleteOffice(office.OfficeId)}>Delete</button>
        <button className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600">Cencel</button>
      </form>
    </div>
  </div>
</dialog>
<ModalAlert 
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        btnText2={alertBtnText2}
        />
    </div>
  );
}

export default AllOffices;
