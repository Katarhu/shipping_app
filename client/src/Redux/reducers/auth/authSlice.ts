import {IAuthResponse, IUser, IUserState} from "../../../Models/IUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loginUser, registerUser, authUser} from './actionCreators';
import {RootState} from "../../store";


const initialState: IUserState = {
    user: null,
    token: null,
    loading: '',
    error: ''
};

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAppError: (state) => {
            state.loading = ''
            state.error = ''
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = '';
            state.error = '';
        }
    },
    extraReducers: {
        [registerUser.pending.type]: (state: IUserState) => {
            state.loading = 'loadingUser'
            state.error = ''
        },
        [registerUser.fulfilled.type]: (state: IUserState, action: PayloadAction<IAuthResponse>) => {
            state.loading = ''
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = '';
        },
        [registerUser.rejected.type]: (state: IUserState, action: PayloadAction<string>) => {
            state.loading = '';
            state.error = action.payload;
        },
        [loginUser.pending.type]: (state: IUserState) => {
            state.error = ''
            state.loading = 'loadingUser'
        },
        [loginUser.fulfilled.type]: (state: IUserState, action: PayloadAction<IAuthResponse>) => {
            state.loading = ''
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = '';
        },
        [loginUser.rejected.type]: (state: IUserState, action: PayloadAction<string>) => {
            state.loading = '';
            state.error = action.payload;
        },
        [authUser.pending.type]: (state: IUserState) => {
            state.error = ''
            state.loading = 'loadingAuth'
        },
        [authUser.fulfilled.type]: (state: IUserState, action: PayloadAction<IAuthResponse>) => {
            state.loading = ''
            state.user = action.payload.user;
            state.error = '';
        },
        [authUser.rejected.type]: (state: IUserState) => {
            state.loading = '';
            state.error = '';
        }
    }
});

export default userSlice.reducer;
export const checkIsAuth = (state: RootState) => Boolean(state.auth.user);
export const {clearAppError} = userSlice.actions;
export const {logout} = userSlice.actions;
export const getRole = (state: RootState) => state.auth?.user?.role;
export const getId = (state: RootState) => state.auth?.user?._id;