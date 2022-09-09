import {ITruck} from "./ITruck";

export interface ILoad {
    _id: string,
    created_by: string,
    assigned_to: string,
    status?: string,
    state?: string,
    name: string,
    payload: number,
    pickup_address: string,
    delivery_address: string,
    dimensions: {
        "width": number,
        "length": number,
        "height": number
    },
    logs: [
        {
            message: string,
            time: string
        }
    ],
    created_date: string
}

export interface ICreateLoad {
    name: string,
    payload: number,
    pickup_address: string,
    delivery_address: string,
    dimensions: {
        "width": number,
        "length": number,
        "height": number
    }
}

export interface IUpdateLoad extends ICreateLoad {
    _id: string;
}

export interface ILoadsResponse {
    loads: ILoad[];
}

export interface ILoadResponse {
    load: ILoad;
}