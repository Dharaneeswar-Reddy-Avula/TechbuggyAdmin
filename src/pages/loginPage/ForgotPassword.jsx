import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use localhost or your production URL
  const API_URL = "http://localhost:8009/api";

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const requestOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/requestResetOTP`, { email });
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const otpCode = otp.join("");
      await axios.post(`${API_URL}/admin/verifyOtp`, { email, otp: otpCode });
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/resetpassword`, {
        email,
        newPassword,
      });
      alert("Password changed successfully. You can login now.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-gray-600 mb-3 text-center">
              Enter the 6-digit OTP sent to your email.
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-10 text-center border rounded text-xl"
                />
              ))}
            </div>
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block mb-2 text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Updating...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
