import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userContext from "../context/user/userContext";
import OfficeContext from "../context/office/officeContext";

function CreateUserForm() {
  const context = useContext(userContext);
  const officeContext = useContext(OfficeContext);
  const { offices, getAllOffices } = officeContext;
  const { user, createUser, uploadProfileImage } = context;
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getAllOffices();
  }, []);

  const formik = useFormik({
    initialValues: {
      ern: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      office: "",
      profileImg: "",
    },
    validationSchema: Yup.object({
      ern: Yup.string().required("ERN is required"),
      firstName: Yup.string().required("First Name is required"),
      middleName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string().required("Role is required"),
      office: Yup.string().required("Office is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        let uploadedImageUrl = imageUrl;

        // Step 1: Upload Image to Backend
        console.log(values.profileImg);
        if (values.profileImg) {
          const formData = new FormData();
          formData.append("profileImg", values.profileImg);
          // console.log(formData);

          const uploadResponse = await uploadProfileImage(formData);

          console.log(uploadResponse.imageUrl);
          uploadedImageUrl = `http://localhost:3000` + uploadResponse.imageUrl;
          setImageUrl(uploadedImageUrl);
        }

        // Step 2: Create User with Image URL
        const response = await createUser(
          values.email,
          values.password,
          values.ern,
          values.firstName,
          values.middleName,
          values.lastName,
          values.role,
          values.office,
          uploadedImageUrl
        );

        console.log(response);
        alert("User created successfully!");
        resetForm();
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Error creating user");
      }
    },
  });

  return (
    <div className="flex items-start justify-center min-h-screen bg-blue-100 w-full">
      <div className="bg-white m-2 p-8 rounded-2xl shadow-md w-1/2">
        <h2 className="text-xl font-semibold text-start text-blue-500 mb-6">
          Create User {user.Role === "SuperAdmin" && " / Admin"}
        </h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          {/* ERN */}
          <div className="relative">
            <input
              type="text"
              name="ern"
              placeholder="Enter ERN"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ern}
              minLength={10}
            />
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fas fa-id-card"></i>
            </span>
            {formik.touched.ern && formik.errors.ern && (
              <p className="text-red-500 text-sm">{formik.errors.ern}</p>
            )}
          </div>

          {/* First Name */}
          <div className="relative">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              minLength={3}
            />
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fas fa-user"></i>
            </span>
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
            )}
          </div>

          {/* Middle Name */}
          <div className="relative">
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.middleName}
              minLength={3}
            />
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fas fa-user"></i>
            </span>
          </div>

          {/* Last Name */}
          <div className="relative">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              minLength={3}
            />
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fas fa-user"></i>
            </span>
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fa-solid fa-envelope"></i>
            </span>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-sm w-full px-4 py-2 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              minLength={6}
            />
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fa-solid fa-key"></i>
            </span>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="relative">
            <select
              name="role"
              className="input input-sm w-full px-4 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
              disabled={user.Role === "Admin"}
            >
              {user.Role==="Admin" || user.Role==="admin"?
              (<>
                <option value="">Select Role</option>
                <option value="User">User</option>
                </>
              ):(
                <option value="">Select Role</option>
              )}
              {user.Role === "SuperAdmin" && (
                <>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </>
              )}
            </select>
            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fa-solid fa-users"></i>
            </span>
            {formik.touched.role && formik.errors.role && (
              <p className="text-red-500 text-sm">{formik.errors.role}</p>
            )}
          </div>

          {/* Office */}
          <div className="relative">
            <select
              name="office"
              className="input input-sm w-full px-4 pl-10 border border-gray-300 hover:border-blue-500 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.office}
            >
              {user.Role==="Admin" || user.Role==="admin"?
              (<>
                <option value="">Select Office</option>
                <option value={user.OfficeId}>{user.OfficeName}</option>
                </>
              ):(
                <>
                {offices.map((office, index) => (
                  <option
                    value={office.OfficeId}
                    key={`${office.OfficeId}-${index}`}
                  >
                    {office.OfficeName}
                  </option>
                ))}
                </>
              )}
              
            </select>

            <span className="absolute left-3 top-1 text-blue-500">
              <i className="fa-solid fa-building-columns"></i>
            </span>
            {formik.touched.office && formik.errors.office && (
              <p className="text-red-500 text-sm">{formik.errors.office}</p>
            )}
          </div>

          {/* Profile Img */}
          <div className="relative">
            <input
              type="file"
              name="profileImg"
              placeholder="Choose Image"
              className="input input-sm w-full text-sm text-gray-500 border border-gray-300 rounded-md p-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition file:mr-4 file:py-0 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              onChange={(event) =>
                formik.setFieldValue("profileImg", event.currentTarget.files[0])
              }
              // value={formik.values.profileImg}
              onBlur={formik.handleBlur}
            />

            {formik.touched.profileImg && formik.errors.profileImg && (
              <p className="text-red-500 text-sm">{formik.errors.profileImg}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn cursor-pointer w-full text-white border-gray-300 bg-blue-500 hover:border-blue-600 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-0 focus:ring-blue-500"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUserForm;
