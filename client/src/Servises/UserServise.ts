import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {IUserProfile} from "../Models/IUser";
import {ITruckResponse} from "../Models/ITruck";

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/api/users'}),
    tagTypes: ['User'],
    endpoints: (build) => ({
        fetchUser: build.query<IUserProfile, any>({
            query: ({}) => ({
                url: '/me',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
            providesTags: result => ['User']
        }),
        changeUserPhoto: build.mutation<{}, FormData>({
            query: (data) => ({
                url: '/me/photo',
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: data
            }),
            invalidatesTags: ['User']
        }),
    })
})
