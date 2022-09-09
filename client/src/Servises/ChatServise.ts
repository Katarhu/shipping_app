import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {IConversation} from "../Models/IChat";


export const chatAPI = createApi({
    reducerPath: 'chatAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/api/chats'}),
    tagTypes: ['Chat'],
    endpoints: (build) => ({
        getConversations: build.query<IConversation[], any>({
            query: () => ({
                url: '/conversations',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            providesTags: result => ['Chat']
        }),
        deleteChat: build.mutation<string, string>({
            query: (_id) => ({
                url: `/${_id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            }),
            invalidatesTags: ['Chat']
        }),
    })
})