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

export const adminRegister = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, role }, { rejectWithValue ,getState}) => {
    try {
      const token = getState().auth.token;
      await axios.post(
        "https://backteg.onrender.com/api/admin/register",
        { name, email, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Admin registered successfully.");
    } catch (err) {
      
      toast.error(err.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        err.response?.data?.message || "Error in Registering the Admin."
      );
    }
  }
);

export const currentAdmin = createAsyncThunk(
  "auth/currentAdmin",
  async (_, { rejectWithValue ,getState}) => {
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
    _id:"",
    email: "",
    role: "",
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      (state.admin = null),
      (state._id=null),
        (state.email = null),
        (state.role = null),
        (state.token = null),
        (state.error=null),
        (state.loading=false),
        localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state._id = action.payload.id;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(adminRegister.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(currentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.admin=action.payload.name;
        state.email=action.payload.email;
        state.name=action.payload.name;
        state.role=action.payload.role;
      })
      .addCase(currentAdmin.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
