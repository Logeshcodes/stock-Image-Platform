import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "../services/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ChangePassword: React.FC = () => {
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
      .required("Please confirm your new password"),
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const toggleCurrent = () => setShowCurrent(!showCurrent);
  const toggleNew = () => setShowNew(!showNew);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/auth/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      console.log("response &&&&" , response)




      if (response.data.success) {
        toast.success("Password changed successfully!");
        navigate("/Dashboard");
        resetForm();
      }else{
        toast.error("Current password was wrong!");
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderPasswordField = (
    name: string,
    label: string,
    show: boolean,
    toggle: () => void
  ) => (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Field
        type={show ? "text" : "password"}
        name={name}
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
      />
      <div
        onClick={toggle}
        className="absolute top-9 right-3 cursor-pointer text-gray-600 hover:text-gray-900 transition"
      >
        {show ? (
          <AiOutlineEyeInvisible size={20} />
        ) : (
          <AiOutlineEye size={20} />
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-blue-700 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Change Password
        </motion.h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {renderPasswordField(
                "currentPassword",
                "Current Password",
                showCurrent,
                toggleCurrent
              )}
              {renderPasswordField(
                "newPassword",
                "New Password",
                showNew,
                toggleNew
              )}
              {renderPasswordField(
                "confirmPassword",
                "Confirm New Password",
                showConfirm,
                toggleConfirm
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
