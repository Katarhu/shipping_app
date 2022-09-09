import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authReducer from './reducers/auth/authSlice'
import {loadAPI} from "../Servises/LoadServise";
import {truckAPI} from "../Servises/TruckServise";
import {userAPI} from "../Servises/UserServise";
import {chatAPI} from "../Servises/ChatServise";

const rootReducer = combineReducers({
    auth: authReducer,
    [loadAPI.reducerPath]: loadAPI.reducer,
    [truckAPI.reducerPath]: truckAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [chatAPI.reducerPath]: chatAPI.reducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(loadAPI.middleware, truckAPI.middleware, userAPI.middleware, chatAPI.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;