import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  requestAdminOtp,
  verifyRegisterOtp,
  mailToNewAdmin,
} from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminRegister = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const {
    registerOtpLoading,
    registerOtpError,
    verifyRegisterOtpLoading,
    verifyRegisterOtpError,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setShowPassword(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password regex: at least 1 uppercase, 1 lowercase, 1 number, 1 special char, and min 8 characters
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setPasswordError("");
    setLoading(true);
    dispatch(requestAdminOtp({ email }))
      .unwrap()
      .then(() => {setOtpModal(true);
        // toast.success("OTP sent Successfully")
      })
      .catch((err) => {
        setError(err);
        // toast.error(err)
      });
    setLoading(false);
  };

  const handleChange = (index, value) => {
    if (!/\d/.test(value) && value !== "") return;
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

  const handleVerifyOtp = async (otp) => {
    dispatch(verifyRegisterOtp({ name, email, password, role, otp }))
      .unwrap()
      .then(() => {
        setOtpModal(false);
        onClose();
        dispatch(mailToNewAdmin({ email, password }));
      })
      .catch(() => {});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex z-50 items-center justify-center bg-gray-800 bg-opacity-50 dark:bg-opacity-80">
      {/* <ToastContainer position="top-left" autoClose={5000} closeOnClick /> */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Admin Register
        </h2>
        {error && (
          <p className="text-red-600 dark:text-red-400 text-center mb-2">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              placeholder="Enter role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={registerOtpLoading}
            >
              {registerOtpLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" size={20} />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>

      {otpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg sm:w-96 w-[96vw] text-black dark:text-white">
            <h2 className="text-xl font-semibold text-center">Enter OTP</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4">
              We've sent an OTP to requested email.
            </p>

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
                  className="w-12 h-12 text-center border rounded-lg text-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setOtpModal(false)}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-200 hover:text-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white transition-all"
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
                  {verifyRegisterOtpLoading ? (
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

export default AdminRegister;
