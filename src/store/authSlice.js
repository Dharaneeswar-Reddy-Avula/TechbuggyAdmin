import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";



const initialState = {
  user: null,
  token:  null,
  loading: false,
  error: null,
};

//login
export const adminLogin = createAsyncThunk(
  "auth/adminlogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await axios.post("http://localhost:8009/api/admin/login", {
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
        "http://localhost:8009/api/admin/verifyOtp",
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

const authSlice=createSlice({
    name:"auth",
    initialState:{
        admin:"",
        email:"",
        role:"",
        token:null,
        loading:false,
        error:null
    },
    reducers:{
        logout:(state)=>{
            state.admin=null,
            state.email=null,
            state.role=null,
            state.token=null,
            localStorage.removeItem("token");
        }   
    },
    extraReducers:(builder)=>{
        builder
        .addCase(adminLogin.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(adminLogin.fulfilled,(state,action)=>{
            state.loading=false;
        })
        .addCase(adminLogin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
        .addCase(verifyOtp.fulfilled,(state,action)=>{
            state.loading=false;
            state.admin=action.payload.admin.name;
            state.email=action.payload.admin.email;
            state.role=action.payload.admin.role;
            state.token=action.payload.token;
        })
        .addCase(verifyOtp.pending,(state)=>{
            state.loading=true;
        })
        .addCase(verifyOtp.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

    }
})
export const { logout } = authSlice.actions;
export default authSlice.reducer;
