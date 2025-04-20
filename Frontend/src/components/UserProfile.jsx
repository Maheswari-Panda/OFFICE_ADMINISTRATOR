import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userContext from "../context/user/userContext";
import YearlyCalendar from "./YearlyCalander";
import UserActivity from "./UserActivity";
import Spinner from "./Spinner";
import ModalAlert from "./ModalAlert";

function UserProfile() {

  const iRef = useRef();
  const context = useContext(userContext);
  const { user,updateUser, uploadProfileImage,uploadSignatureImage,setUser } = context;
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.ProfileImageUrl);
  const [isOldImage, setIsOldImage] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileUpdating,setIsProfileUpdating] = useState(false);

  
    const [alertHeading,setAlertHeading]=useState("");
    const [alertDescription,setAlertDescription]=useState("");
    const [alertBtnText2,setAlertBtnText2] = useState("Ok");
    const modalRef=useRef();
  
  const [userLogs,setUserLogs]=useState([]);
  const {getUserLogs}=context;
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userLogs = await getUserLogs(user.UserId);  // Fetch logs for the specific user
        setUserLogs(userLogs);
      } catch (error) {
        console.error("Failed to load user logs:", error);
      }
      finally{
        setTimeout(()=>{
          setIsLoading(false);
        },200);
      }
    };

    fetchLogs();
  }, [user.UserId]);

  // console.log(userLogs);

  const formik = useFormik({
    initialValues: {
      ern: user.ERN,
      firstName: user.FirstName,
      middleName: user.MiddleName,
      lastName: user.LastName,
      email: user.Email,
      role: user.Role,
      office: user.OfficeName,
      profileImg: imageUrl,
    },
    validationSchema: Yup.object({
      ern: Yup.string().required("ERN is required"),
      firstName: Yup.string().required("First Name is required"),
      middleName: Yup.string(),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      role: Yup.string().required("Role is required"),
      office: Yup.string().required("Office is required"),
    }),
    onSubmit: async (values) => {
      setIsProfileUpdating(true);
      setIsEditing(false);
      try {
        let uploadedImageUrl = imageUrl;
        // console.log(imageUrl);
        if(!isOldImage){
          // Step 1: Upload Image to Backend
          // console.log(values.profileImg);
  
          if (values.profileImg) {
            const formData = new FormData();
            formData.append("profileImg", values.profileImg);
            // console.log(formData);
  
            const uploadResponse = await uploadProfileImage(formData);
  
            // console.log(uploadResponse.imageUrl);
            uploadedImageUrl = `http://localhost:3000` + uploadResponse.imageUrl;
            setImageUrl(uploadedImageUrl);
          }
        }
        // Step 2: Create User with Image URL
        const response = await updateUser(
          user.UserId,
          values.email,
          values.ern,
          values.firstName,
          values.middleName,
          values.lastName,
          values.role,
          user.OfficeId,
          uploadedImageUrl
        );

        // console.log(response);
        // console.log(uploadedImageUrl);
        if(response){
          setIsProfileUpdating(false);
          setAlertHeading("Profile Updated");
          setAlertDescription("Your Profile has been updated successfully!");
          modalRef.current.click();
          // alert("Profile updated successfully!");
        }
        else{
          setIsProfileUpdating(false);
          setAlertHeading("Error Updating Profile");
          setAlertDescription("Null Response while upadating Profile!");
          modalRef.current.click();
          // alert("Null Response while upadating user");
        }
      } catch (error) {
        setIsProfileUpdating(false);
        setAlertHeading("Error Updating Profile Info");
        setAlertDescription("Error updating profile: "+ error);
        modalRef.current.click();
        console.error("Error updating user:", error);
        // alert("Error updating user");
      }
    },
  });

  const handleSignatureUpload = async (event) => {
    const file = event.currentTarget.files[0];
    console.log(file);


    if (!file) {
        alert("Please select a file.");
        return;
    }

    if (file.type !== "image/png") {
        alert("Please upload a valid PNG image.");
        return;
    }

    const formData = new FormData();
    formData.append("signature", file);
    console.log(formData);

    try {
        const response = await uploadSignatureImage(formData);  // Using uploadSignatureImage function
        console.log(response);
        if (response && response.imageUrl) {
            alert("Signature uploaded successfully!");
            // Update user state with the new signature URL
            setUser(prevUser => ({ ...prevUser, SignatureImageUrl: response.imageUrl }));
        } else {
            alert("Failed to upload signature.");
        }
    } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading signature. Please try again.");
    }
};

  

  return (
    <div className="w-full mx-auto bg-blue-100 p-4 items-start justify-center h-full">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full h-full lg:flex lg:justify-center gap-2">
      {isProfileUpdating && <Spinner/>}
      {!isProfileUpdating && <div className="p-5 border-2 rounded-md border-dashed border-gray-300 lg:w-1/2 sm:w-full">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Profile Image */}
              <img
                src={imageUrl || "default-image.jpg"}
                alt="Profile Image"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
              {/* Edit Icon */}
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md"
                onClick={() => iRef.current?.click()}
                disabled={!isEditing}
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          {/* User Info Form using Formik */}
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              {/* First Name */}
              <div className="flex gap-2 flex-wrap lg:flex-nowrap md:flex-nowrap">
                <input
                  type="file"
                  id="profileImg"
                  name="profileImg"
                  className="input-sm border border-gray-300 p-2 rounded-md w-full max-w-xs"
                  onChange={(event) =>
                    formik.setFieldValue(
                      "profileImg",
                      event.currentTarget.files[0]
                    )
                  }
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  ref={iRef}
                  onClick={()=>setIsOldImage(false)}
                  hidden
                />
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-xs">ERN</span>
                  </div>
                  <input
                    type="text"
                    id="ern"
                    name="ern"
                    className="input-sm border border-gray-300 p-2 rounded-md w-full max-w-xs"
                    value={formik.values.ern}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                  />
                  {formik.touched.ern && formik.errors.ern && (
                    <p className="text-red-500 text-sm">{formik.errors.ern}</p>
                  )}
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-xs">First Name</span>
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="input-sm border border-gray-300 p-2 rounded-md w-full max-w-xs"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.firstName}
                    </p>
                  )}
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-xs">Middle Name</span>
                  </div>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    className="input-sm border border-gray-300 p-2 rounded-md w-full max-w-xs"
                    value={formik.values.middleName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                  />
                  {formik.touched.middleName && formik.errors.middleName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.middleName}
                    </p>
                  )}
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-xs">Last Name</span>
                  </div>

                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input-sm border border-gray-300 p-2 rounded-md w-full max-w-xs"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.lastName}
                    </p>
                  )}
                </label>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label htmlFor="email" className="text-sm text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-sm border border-gray-300 p-2 rounded-md w-full"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label htmlFor="role" className="text-sm text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="input-sm border border-gray-300 p-2 rounded-md w-full"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled
                />
              </div>

              {/* Office */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label htmlFor="office" className="text-sm text-gray-700">
                  Office
                </label>
                <input
                  type="text"
                  id="office"
                  name="office"
                  className="input-sm border border-gray-300 p-2 rounded-md w-full"
                  value={formik.values.office}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end items-center gap-1">
                <button
                  type="button"
                  className="btn btn-sm bg-blue-500 text-white rounded text-sm  hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                >
                  <i className="fas fa-edit text-white"></i>
                  Edit
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  disabled={!isEditing}
                >
                  <i className="fa-solid fa-check text-white"></i>
                  Update
                </button>
              </div>
            </div>
            {user.Role.toLowerCase() === "admin" && (
                <>
            <div className="flex items-center justify-between mt-5">
                  {user?.SignatureImageUrl && user?.SignatureImageUrl !== "NULL" ? (
                    <img src={user.SignatureImageUrl} alt="Signature" className="h-20 w-50 border border-gray-500" />
                  ) : (
                    <span className="text-gray-500">No signature uploaded</span>
                  )}

                  <label className="text-sm hover:text-blue-500 cursor-pointer flex items-center">
                    <i className="fa-solid fa-edit text-blue-500 mx-2"></i>
                    <span>{!user?.SignatureImageUrl || user?.SignatureImageUrl === "NULL" ? "Upload Signature" : "Change Signature"}</span>
                    <input type="file" accept="image/png" className="hidden" onChange={handleSignatureUpload} />
                  </label>
            </div>
                </>
            )}

          </form>
        </div>
      }

        <div className=" border-2 rounded-md border-dashed border-gray-300 lg:w-1/2 lg:h-165 sm:w-full">
        {isLoading ? (<Spinner/>):(<UserActivity userLogs={userLogs}/>)}
        </div>
      </div>
      <div className="flex">
          <YearlyCalendar userLog={userLogs} />
        </div>

      <ModalAlert
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        btnText2={alertBtnText2}
      />
    </div>
  );
}

export default UserProfile;
