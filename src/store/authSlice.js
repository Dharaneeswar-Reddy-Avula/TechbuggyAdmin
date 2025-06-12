import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

//login
export const adminLogin = createAsyncThunk(
  "auth/adminlogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await axios.post("https://backteg.onrender.com/api/admin/login", {
        email,
        password,
      });
      toast.success("OTP sent Successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

//verify otp
// https://backteg.onrender.com
export const verifyOtp = createAsyncThunk(
  "auth/verifyotp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://backteg.onrender.com/api/admin/verifyOtp",
        { email, otp }
      );
      toast.success("Login Successful!");

      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// Request OTP for registration
export const requestAdminOtp = createAsyncThunk(
  "auth/requestAdminOtp",
  async ({ email }, { rejectWithValue,getState }) => {
    try {
      const token = getState().auth.token;
      await axios.post(
        "https://backteg.onrender.com/api/admin/register/request-otp",
        {
          email,
        },{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        }
      );
      toast.success("OTP sent to the requested email for verification.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
      return rejectWithValue(
        err.response?.data?.message || "OTP request failed"
      );
    }
  }
);

// Verify OTP and register the admin
export const verifyRegisterOtp = createAsyncThunk(
  "auth/verifyRegisterOtp",
  async ({ name, email, password, role, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://backteg.onrender.com/api/admin/register/verify-otp",
        {
          name,
          email,
          password,
          role,
          otp,
        }
      );
      toast.success("Admin registered successfully.");
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const mailToNewAdmin = createAsyncThunk(
  "auth/mailToNewAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await axios.post(
        "https://backteg.onrender.com/api/admin/mailToNewAdmin",
        { email, password }
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Error in sending mail to newly registered admin."
      );
    }
  }
);

export const currentAdmin = createAsyncThunk(
  "auth/currentAdmin",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        "https://backteg.onrender.com/api/admin/currentAdmin",
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.currentAdmin;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error in fetching admin details."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: "",
    _id: "",
    email: "",
    role: "",
    token: null,
    loading: false,
    loginLoading: false,
    registerOtpLoading: false,
    registerOtpError: null,
    verifyRegisterOtpLoading: false,
    verifyRegisterOtpError: null,
    otpLoading: false,
    error: null,
    loginError: null,
    otpError: null,
    currentAdminError: null,
    mailError: null,
  },
  reducers: {
    logout: (state) => {
      (state.admin = null),
        (state._id = null),
        (state.email = null),
        (state.role = null),
        (state.token = null),
        (state.error = null),
        (state.loading = false),
        localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
        
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loginError = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state._id = action.payload.id;
        state.token = action.payload.token;
        state.otpError = null;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload;
      })
      // Request OTP for registration
      .addCase(requestAdminOtp.pending, (state) => {
        state.registerOtpLoading = true;
        state.registerOtpError = null;
      })
      .addCase(requestAdminOtp.fulfilled, (state) => {
        state.registerOtpLoading = false;
        state.registerOtpError = null;
      })
      .addCase(requestAdminOtp.rejected, (state, action) => {
        state.registerOtpLoading = false;
        state.registerOtpError = action.payload;
      })

      // Verify OTP and complete registration
      .addCase(verifyRegisterOtp.pending, (state) => {
        state.verifyRegisterOtpLoading = true;
        state.verifyRegisterOtpError = null;
      })
      .addCase(verifyRegisterOtp.fulfilled, (state) => {
        state.verifyRegisterOtpLoading = false;
        state.verifyRegisterOtpError = null;
      })
      .addCase(verifyRegisterOtp.rejected, (state, action) => {
        state.verifyRegisterOtpLoading = false;
        state.verifyRegisterOtpError = action.payload;
      })

      .addCase(currentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdminError = null;
        state.admin = action.payload.name;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.role = action.payload.role;
      })
      .addCase(currentAdmin.pending, (state, action) => {
        state.loading = true;
        state.currentAdminError = null;
      })
      .addCase(currentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.currentAdminError = action.payload;
      })
      .addCase(mailToNewAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.mailError = null;
      })
      .addCase(mailToNewAdmin.pending, (state, action) => {
        state.loading = true;
        state.mailError = null;
      })
      .addCase(mailToNewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.mailError = action.payload;
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
