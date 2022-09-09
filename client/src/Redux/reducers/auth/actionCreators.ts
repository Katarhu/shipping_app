import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from '../../../Utils/axios';
import {IUserLogin, IUserRegister} from "../../../Models/IUser";


export const registerUser = createAsyncThunk(
    'auth/register',
    async ({email, password, role}: IUserRegister, thunkAPI) => {
        try {
            const {data} = await axios.post('/auth/register', {
                email,
                password,
                role
            });

            window.localStorage.setItem('token', data.jwt_token);

            return data
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({email, password}: IUserLogin, thunkAPI) => {
        try {
            const {data} = await axios.post('/auth/login', {
                email,
                password
            });

            window.localStorage.setItem('token', data.jwt_token);

            return data
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

export const authUser = createAsyncThunk(
    'auth/',
    async (_, thunkAPI) => {
        try {
            const {data} = await axios.get('/auth/');

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue('');
        }
    }
)
