import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext, useEffect } from "react";
import userContext from "../context/user/userContext";
import { useState } from "react";

const ChangePassword = () => {
  const { token } = useParams(); // Get userId from URL
//   console.log(token);
  const {resetPassword,verifyResetPasswordToken} = useContext(userContext);
  const navigate = useNavigate();

  const [email,setEmail]=useState("");
  const [userId,setUserId]=useState(0);
  const [isValidToken,setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
        try {
            const response = await verifyResetPasswordToken(token);
            // console.log(response);
            if (response) {
                setEmail(response.email);
                setUserId(response.userId);
                setIsValidToken(true);
            } else {
                navigate("/forgetpassword");
                alert("The reset link is invalid or expired.",response);
            }
        } catch (error) {
            alert("reset link session expired!")
            console.error("Error validating token:", error);
        }
    };
    validateToken();
}, [token]);

// console.log(email);
// console.log(userId);
  // Yup Validation Schema
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters!")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter!")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter!")
      .matches(/\d/, "Password must contain at least one number!")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character!")
      .required("Password is required!"),
    
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match!")
      .required("Confirm password is required!")
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await resetPassword(userId,email,values.newPassword)

      if (response) {
          resetForm(); // Clear form after successful reset
          navigate("/");
          return response;
      } else {
        alert("error in response of reset password ");
      }
    } catch (error) {
      console.error("Error updating password", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    {isValidToken &&
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Reset Your Password</h2>
        
        <Formik
          initialValues={{ email: email || "", newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Read-Only Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  readOnly
                  className="input input-sm mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                />
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  className="input input-sm mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 "
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="input input-sm mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 "
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
              >
                {isSubmitting ? "Updating..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
       
      </div>
    </div>
    
}
    
    <div className="flex justify-center text-center bg-blue-500 border-t p-3 border-dashed border-white">
          <img src="../src/assets/msu_logo_white.png" alt="Logo" className="h-12" />
          <div className="flex items-center px-3">
            <p className="text-sm text-white text-center">
                <b>Office Administrator</b>
                <br />
                Developed by <span className="hover:underline cursor-pointer">maheswaripanda3@gmail.com</span></p>
          </div>
        </div>
    </>
  );
};

export default ChangePassword;
