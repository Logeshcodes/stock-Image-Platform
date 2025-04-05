import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, PhoneIcon, UserIcon, MailIcon, LockIcon, ImageIcon } from "lucide-react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();

  // Background animation effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Yup validation schema
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9+\s-]+$/, 'Phone number must contain only digits, +, spaces or hyphens')
      .min(7, 'Phone number is too short')
      .max(15, 'Phone number is too long'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Password is required')
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong!");
      } else {
        await response.json();
        
        // Success animation sequence
        setLoading(false);
        
        // Show success animation before redirecting
        setTimeout(() => {
          toast.success("Sign up successful!");
          navigate("/login");
        }, 500);
      }
    } catch (error) {
      console.error("Error during signup", error);
      toast.error("Sign up failed!");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.97 }
  };

  const focusField = (fieldName: any) => {
    setActiveField(fieldName);
  };

  const blurField = () => {
    setActiveField(null);
  };

  const getFieldStyle = (fieldName: any, errors: any, touched: any) => {
    const isError = errors[fieldName] && touched[fieldName];
    
    if (activeField === fieldName) {
      return `pl-10 shadow-lg border-2 ${isError ? 'border-red-500' : 'border-indigo-500'} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`;
    }
    
    return `pl-10 shadow border ${isError ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-6 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-purple-300 opacity-20 blur-3xl"
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", damping: 50 }}
        />
        <motion.div 
          className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-blue-300 opacity-20 blur-3xl"
          animate={{
            x: -mousePosition.x * 0.02,
            y: -mousePosition.y * 0.02,
          }}
          transition={{ type: "spring", damping: 50 }}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-xl relative z-10"
      >
        <motion.div 
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)"
          }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header with Stock Image Platform Graphic */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center relative overflow-hidden">
            <motion.div 
              animate={{ 
                rotate: [0, 360],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full opacity-30"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bottom-2 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="flex items-center justify-center mb-3">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <ImageIcon size={40} className="text-white" />
                </motion.div>
              </div>
              <h2 className="text-4xl font-bold text-white">Stock Images</h2>
              <p className="text-indigo-100 mt-3 text-lg">Create your premium account</p>
            </motion.div>
          </div>

          <Formik
            initialValues={{
              username: "",
              email: "",
              phoneNumber: "",
              password: ""
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, isSubmitting }) => (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Form className="p-8 space-y-6">
                  {/* Username Field */}
                  <motion.div 
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <label htmlFor="username" className="block text-gray-700 text-sm font-medium">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserIcon size={20} className={activeField === "username" ? "text-indigo-600" : "text-gray-500"} />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        name="username"
                        id="username"
                        className={getFieldStyle("username", errors, touched)}
                        placeholder="Choose a username"
                        value={values.username}
                        onChange={handleChange}
                        onFocus={() => focusField("username")}
                        onBlur={blurField}
                      />
                    </div>
                    <ErrorMessage name="username">
                      {msg => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                    </ErrorMessage>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div 
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MailIcon size={20} className={activeField === "email" ? "text-indigo-600" : "text-gray-500"} />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="email"
                        name="email"
                        id="email"
                        className={getFieldStyle("email", errors, touched)}
                        placeholder="your@email.com"
                        value={values.email}
                        onChange={handleChange}
                        onFocus={() => focusField("email")}
                        onBlur={blurField}
                      />
                    </div>
                    <ErrorMessage name="email">
                      {msg => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                    </ErrorMessage>
                  </motion.div>

                  {/* Phone Number Field */}
                  <motion.div 
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <PhoneIcon size={20} className={activeField === "phoneNumber" ? "text-indigo-600" : "text-gray-500"} />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        className={getFieldStyle("phoneNumber", errors, touched)}
                        placeholder="phone number"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onFocus={() => focusField("phoneNumber")}
                        onBlur={blurField}
                      />
                    </div>
                    <ErrorMessage name="phoneNumber">
                      {msg => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                    </ErrorMessage>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div 
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <LockIcon size={20} className={activeField === "password" ? "text-indigo-600" : "text-gray-500"} />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        className={getFieldStyle("password", errors, touched)}
                        placeholder="Create a strong password"
                        value={values.password}
                        onChange={handleChange}
                        onFocus={() => focusField("password")}
                        onBlur={blurField}
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOffIcon size={20} className="text-gray-500 hover:text-indigo-600" />
                        ) : (
                          <EyeIcon size={20} className="text-gray-500 hover:text-indigo-600" />
                        )}
                      </motion.button>
                    </div>
                    <ErrorMessage name="password">
                      {msg => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                    </ErrorMessage>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ${
                      loading || isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={loading || isSubmitting}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {loading || isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Creating Your Account...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Create Account
                        <motion.span 
                          animate={{ x: [0, 3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="ml-2"
                        >
                          →
                        </motion.span>
                      </span>
                    )}
                  </motion.button>
                </Form>
              </motion.div>
            )}
          </Formik>

          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 px-8 py-6 border-t border-gray-200"
          >
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
        
        {/* Floating Stock Image Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute -top-8 -left-8 text-white opacity-20"
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              ease: "easeInOut" 
            }}
          >
            <ImageIcon size={48} />
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute -bottom-10 -right-10 text-white opacity-20"
        >
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0, 5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <ImageIcon size={64} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;