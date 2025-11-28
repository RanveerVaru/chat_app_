import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";



export const getUser = createAsyncThunk("user/me",async (_,thunkAPI) =>{
    try {
        const res = await axiosInstance.get("user/me");
        // connectSocket(res.data.user_id);
        return res.data.user;
    } catch (error) {
        console.log("Error in fetching  user:",error);
        return thunkAPI.rejectWithValue(error.response.data || "Error in fetching  user:" );
    }
}
);

export const logout = createAsyncThunk("user/sign-out",async (_,thunkAPI) =>{
    try {
        await axiosInstance.get("user/sign-out");
        disconnectSocket();
        return null;
    } catch (error) {
        toast.error("Error in Logged Out");
        console.log("Error in logging out user:",error);
        return thunkAPI.rejectWithValue(error.response.data || "Error in logging out user:" );
    }
}
);
export const login = createAsyncThunk("user/sign-in",async (data,thunkAPI) =>{
    try {
         const res = await axiosInstance.post("user/sign-in",data);
        connectSocket(res.data.user._id);
        //    const user = await thunkAPI.dispatch(getUser()).unwrap();
        toast.success("Logged in successfully");
        return res.data.user;
    } catch (error) {
        toast.error("Error in logging in user");
        console.log("Error in logging in user:",error);
        return thunkAPI.rejectWithValue(error.response.data || "Error in logging in user:" );
    }
}
);

export const register = createAsyncThunk("user/sign-up",async (data,thunkAPI) =>{
    try {
        const res = await axiosInstance.post("user/sign-up",data);
        connectSocket(res.data.user._id)
        toast.success("Registered successfully");
        return res.data.user;
    } catch (error) {
        toast.error("Error in sign up!!");
         console.log("Error in signing user:",error);
        return thunkAPI.rejectWithValue(error.response.data || "Error in signing user:" );
    }
})

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData, thunkAPI) => {
      try {
        const res = await axiosInstance.put("/user/update-profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        toast.success(res.data.message || "Profile updated successfully");
        return res.data.user; // updated user from backend
      } catch (error) {
        const msg =
          error.response?.data?.message || "Failed to update profile";
        toast.error(msg);
        return thunkAPI.rejectWithValue(msg);
      }
    }
  );



const authSlice = createSlice({
    name : "auth",
    initialState : {
        authUser : null,
        isSigningIn : false,
        isSigningUp : false,
        isUpdatingProfile : false,
        isCheakingAuth : true,
        onlineUsers : [],
    },
    reducers : {
        setOnlineUsers(state,action){
            state.onlineUsers = action.payload;
        }
    },
    extraReducers : (builder) =>{
        builder.addCase(getUser.fulfilled,(state,action)=>{
            state.authUser = action.payload;
            state.isCheakingAuth = false;
        })
        .addCase(getUser.rejected,(state,action)=>{
            state.authUser = null;
            state.isCheakingAuth = false;
        }).addCase(logout.fulfilled,(state,action)=>{
            state.authUser = null;
        }).addCase(logout.rejected,(state,action)=>{
            // Handle logout error if needed
            state.authUser  =  state.authUser
        }).addCase(login.pending,(state,action)=>{
            state.isSigningIn = true;
        }).addCase(login.fulfilled,(state,action)=>{
            state.authUser = action.payload;
            state.isSigningIn = false;
        }).addCase(login.rejected,(state,action)=>{
            state.isSigningIn = false;
        }).addCase(register.pending,(state,action)=>{
            state.isSigningUp = true;
        }).addCase(register.fulfilled,(state,action)=>{
            state.authUser = action.payload;
            state.isSigningUp = false;
        }).addCase(register.rejected,(state,action)=>{
            state.isSigningUp = false;
        }).addCase(updateProfile.pending, (state) => {
          state.isUpdatingProfile = true;
        }).addCase(updateProfile.fulfilled, (state, action) => {
          state.isUpdatingProfile = false;
          state.authUser = action.payload; // update user in Redux
        }).addCase(updateProfile.rejected, (state) => {
          state.isUpdatingProfile = false;
        });

    }

});

export const {setOnlineUsers} = authSlice.actions;
export default authSlice.reducer;

// logout: (state) => { state.authUser = null; }
//   runs synchronously only
//   cannot call axios, cannot do await, cannot talk to backend
//   just updates state
//   But logout in a real app often needs to:
//   call backend /user/sign-out
//   clear cookie/token on server
//   maybe disconnect socket
//   then update Redux state
//   All that is async logic, not allowed inside a normal reducer.

//async (arg, thunkAPI) => { ... } arg is replaced by _ → means “we’re not using this argument”
//thunkAPI is an object with helpful tools eg : dispatch(signOut()) // arg = undefined, dispatch(signOut(123)) // arg = 123

//thunkAPI gives you: dispatch → to dispatch other actions,getState → read current Redux state,rejectWithValue(error) → return a custom error payload+





