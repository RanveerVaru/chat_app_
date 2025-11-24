import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";


export const getUsers = createAsyncThunk("chat/getusers",async (_,thunkAPI) =>{
    try {
        const res = await axiosInstance.get("/message/users");
        // console.log("from chatslice getUser",res.data);
        return res.data.users;
    } catch (error) {
        toast.error("messssss",error.response?.data?.message || error.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const getMessages = createAsyncThunk("chat/getMessages",async (userId,thunkAPI) =>{
    try {
        const res = await axiosInstance.get(`/message/${userId}`);
        return res.data?.messages;
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const sendMessage   = createAsyncThunk("chat/sendMessage" , async (messageData , thunkAPI) => {
    try {
        const {chat} = thunkAPI.getState();
        const res = await axiosInstance.post(`/message/send/${chat.selectedUser._id}`, messageData)

        return res.data.newMessage;
    } catch (error) {
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})


const chatSlice = createSlice({
    name : "chat",
    initialState : {
        messages : [],
        users : [],
        selectedUser : null,
        isUsersLoading : false,
        isMessagesLoading : false,

    },
    reducers : {
        setSelectedUser : (state,action ) =>{
            // console.log("selected user in slice", action.payload);
            state.selectedUser = action.payload;

        },
        pushNewMessage : (state,action) =>{
            state.messages.push(action.payload);
        }
    },
    extraReducers : (builder) =>{
        builder.addCase(getUsers.pending,(state,action) =>{
            state.isUsersLoading = true;
        }).addCase(getUsers.fulfilled,(state,action) =>{
            state.users = action.payload;
            state.isUsersLoading = false;
        }).addCase(getUsers.rejected,(state,action) =>{
            state.isUsersLoading = false;
        }).addCase(getMessages.pending,(state,action) =>{
            state.isMessagesLoading = true;
        }).addCase(getMessages.fulfilled,(state,action) =>{
            state.messages = action.payload;
            state.isMessagesLoading = false;
        }).addCase(getMessages.rejected,(state,action) =>{
            state.isMessagesLoading = false;
        }).addCase(sendMessage.fulfilled,(state,action) =>{
            state.messages.push(action.payload);
        });
}});

export const {setSelectedUser , pushNewMessage} = chatSlice.actions;
export default chatSlice.reducer;