import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ITruckResponse} from "../Models/ITruck";

interface truckReq {
    _id: string;
    type: string
}

export const truckAPI = createApi({
    reducerPath: 'truckAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/api/trucks'}),
    tagTypes: ['Truck'],
    endpoints: (build) => ({
        fetchTrucks: build.query<ITruckResponse, any>({
            query: ({}) => ({
                url: '/',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
            providesTags: result => ['Truck']
        }),
        createTruck: build.mutation<ITruckResponse, string>({
            query: (type: string) => ({
                url: '',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: {
                    type
                }
            }),
            invalidatesTags: ['Truck']
        }),
        updateTruck: build.mutation<ITruckResponse, truckReq>({
            query: ({_id, type}) => ({
                url: `/${_id}`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: {
                    type
                }
            }),
            invalidatesTags: ['Truck']
        }),
        deleteTruck: build.mutation<ITruckResponse, string>({
            query: (_id) => ({
                url: `/${_id}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            invalidatesTags: ['Truck']
        }),
        assignTruck: build.mutation<ITruckResponse, string>({
            query: (_id) => ({
                url: `/${_id}/assign`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            invalidatesTags: ['Truck']
        }),
    })
})