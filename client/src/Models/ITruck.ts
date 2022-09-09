export interface ITruck {
    _id: string;
    created_by: string;
    assigned_to: string;
    type: string;
    status: string;
    created_date: string;
    payload: number;
    dimensions: {
        width: number;
        height: number;
        length: number;
    }
}

export interface ITruckResponse {
    trucks: ITruck[]
}

export enum TruckTypes {
    Create = 'Create',
    Change = 'Change'
}

interface ICreateTruck {
    modalType: TruckTypes.Create;
    truckType: string;
    _id?: undefined;
    open: boolean;
    onClose: () => void;
}

interface IUpdateTruck {
    modalType: TruckTypes.Change;
    _id: string;
    truckType: string;
    open: boolean;
    onClose: () => void;
}

type TruckProps = IUpdateTruck | ICreateTruck;

export default TruckProps;