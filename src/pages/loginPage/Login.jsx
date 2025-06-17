import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, verifyOtp,currentAdmin } from "../../store/authSlice";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginLoading, loginError, token } = useSelector((state) => state.auth);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/dashboard"); // Redirect after login
    }
  }, [token, navigate]);

  const handleChange = (index, value) => {
    if (!/\d/.test(value) && value !== "") return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    setSendLoading(true);
    e.preventDefault();
    dispatch(adminLogin({ email, password }))
      .unwrap()
      .then(() => setOtpModal(true))
      .catch(() => {});
    setSendLoading(false);
  };

  const handleVerifyOtp = async (otp) => {
    dispatch(verifyOtp({ email, otp }))
      .unwrap()
      .then(() => {
        setOtpModal(false);
      })
      .then(() => {
  toast.success("OTP Verified Successfully!");
  setOtpModal(false);
})
.catch(() => {
  toast.error("Invalid OTP. Please try again.");
});

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">Admin Login</h2>
        {loginError && <p className="text-red-600 text-center">{loginError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
               <Link
            to="/forgotPassword"
            className="flex justify-center text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>{" "}
              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" size={20} />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>

      {otpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg sm:w-96 w-[96vw]">
            <h2 className="text-xl font-semibold text-center dark:text-white">Enter OTP</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm text-center mb-4">We've sent an OTP to your email.</p>

            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center border rounded-lg text-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setOtpModal(false)}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-all dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyOtp(otp.join(""))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Verify OTP
              </button>
            </div>

            <div className="text-center w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                Didn't receive the otp?{" "}
                <button
                  onClick={handleSubmit}
                  className="text-blue-500 dark:text-blue-400 hover:underline"
                >
                  {sendLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin" size={15} />
                      Sending...
                    </span>
                  ) : (
                    "Resend"
                  )}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
