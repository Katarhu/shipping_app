import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ILoadResponse, ILoad, ILoadsResponse, ICreateLoad, IUpdateLoad} from "../Models/ILoad";

interface IFetchLoadsProps {
    limit?: number;
    offset?: number;
    status?: string
}

export const loadAPI = createApi({
    reducerPath: 'loadAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/api/loads'}),
    tagTypes: ['Load'],
    endpoints: (build) => ({
        fetchLoads: build.query<ILoadsResponse, IFetchLoadsProps>({
            query: ({limit, offset = 0, status = ''}: IFetchLoadsProps) => ({
                url: '/',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    limit,
                    offset,
                    status
                }
            }),
            providesTags: result => ['Load']
        }),
        getActiveLoad: build.query<ILoadResponse, void>({
            query: () => ({
                url: '/active',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            providesTags: result => ['Load']
        }),
        createLoad: build.mutation<void, ICreateLoad>({
            query: (load) => ({
                url: '',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: load
            }),
            invalidatesTags: ['Load']
        }),
        updateLoad: build.mutation<void, IUpdateLoad>({
            query: (load) => ({
                url: `/${load._id}`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: load
            }),
            invalidatesTags: ['Load']
        }),
        postLoad: build.mutation<void, string>({
            query: (_id) => ({
                url: `/${_id}/post`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            invalidatesTags: ['Load']
        }),
        proceedLoad: build.mutation<void, void>({
            query: () => ({
                url: `/active/state`,
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            invalidatesTags: ['Load']
        }),
        deleteLoad: build.mutation<void, string>({
            query: (_id) => ({
                url: `/${_id}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            invalidatesTags: ['Load']
        })
    })
})