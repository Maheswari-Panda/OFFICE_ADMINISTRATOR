import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import YearlyCalendar from "./YearlyCalander";

function UserProfile({ user }) {
    const userLog = [
        { userId: 1, name: "John Doe", timestamp: "2024-01-05T09:30:00" },
        { userId: 2, name: "Alice Smith", timestamp: "2024-01-10T14:15:00" },
        { userId: 1, name: "John Doe", timestamp: "2024-02-20T11:00:00" },
        { userId: 3, name: "Bob Johnson", timestamp: "2024-03-05T16:45:00" },
        { userId: 2, name: "Alice Smith", timestamp: "2024-04-12T08:20:00" },
        { userId: 4, name: "Emily Davis", timestamp: "2024-05-25T10:10:00" },
        { userId: 3, name: "Bob Johnson", timestamp: "2024-06-30T19:00:00" },
        { userId: 1, name: "John Doe", timestamp: "2024-07-15T12:50:00" },
        { userId: 2, name: "Alice Smith", timestamp: "2024-08-22T09:10:00" },
        { userId: 4, name: "Emily Davis", timestamp: "2024-09-18T13:30:00" },
        { userId: 1, name: "John Doe", timestamp: "2024-10-05T07:45:00" },
        { userId: 3, name: "Bob Johnson", timestamp: "2024-11-10T15:20:00" },
        { userId: 2, name: "Alice Smith", timestamp: "2024-12-01T11:05:00" }
      ];
      
  const [isEditing, setIsEditing] = useState(false);

  const initialValues = {
    firstName: user.FirstName,
    middleName: user.MiddleName,
    lastName: user.LastName,
    email: user.Email,
    password: user.Password,
    role: user.Role,
    office: user.OfficeId,
    profileImg: user.ProfileImageUrl,
  };

  const handleSubmit = (values) => {
    console.log(values);
    // Handle form submission (e.g., API call)
  };

  return (
    <div className="w-full mx-auto bg-blue-100 p-4 flex items-start justify-center h-screen">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex justify-center">
        <div className="p-5 border-2 rounded-md border-dashed boreder-gray-300">
            {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Profile Image */}
            <img
              src={initialValues.profileImg || "default-image.jpg"}
              alt="Profile Image"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
            {/* Edit Icon */}
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className="fas fa-edit"></i>
            </button>
          </div>
        </div>

        {/* User Info Form using Formik */}
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, handleChange, handleBlur }) => (
            <Form className="space-y-4">
              {/* First Name */}
              <div className="flex gap-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-xs">First Name</span>
                  </div>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="input-sm border rounded-md w-full max-w-xs"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!isEditing}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-xs">Middle Name</span>
                  </div>
                  <Field
                  type="text"
                  id="middleName"
                  name="middleName"
                  className="input-sm border rounded-md w-full max-w-xs"
                  value={values.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!isEditing}
                />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-xs">Last Name</span>
                  </div>

                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input-sm border rounded-md w-full max-w-xs"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!isEditing}
                  />
                </label>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                
                <label htmlFor="email" className="text-sm text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="input-sm border rounded-md w-full"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!isEditing}
                />
              </div>

              {/* Role */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label htmlFor="role" className="text-sm text-gray-700">
                  Role
                </label>
                <Field
                  type="text"
                  id="role"
                  name="role"
                  className="input-sm border rounded-md w-full"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!isEditing}
                />
              </div>

              {/* Office */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label htmlFor="office" className="text-sm text-gray-700">
                  Office
                </label>
                <Field
                  type="text"
                  id="office"
                  name="office"
                  className="input-sm border rounded-md w-full"
                  value={values.office}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!isEditing}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded my-3 text-sm mt-4 hover:bg-blue-600"
                  disabled={!isEditing}
                >
                  <i className="fas fa update"></i>
                  Update Profile
                </button>
              </div>
            </Form>
          )}
        </Formik>
        </div>

        <div className="">
            <YearlyCalendar userLog={userLog}/>

        </div>

      </div>
    </div>
  );
}

export default UserProfile;
