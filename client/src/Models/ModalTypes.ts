export enum ModalTypes {
    Create = 'Create',
    Change = 'Change'
}

interface CreateModal {
    modalType: ModalTypes.Create;
    _id?: undefined;
    name?: undefined;
    pickup_address?: undefined;
    delivery_address?: undefined;
    payload?: undefined
    dimensions?: undefined
    open: boolean;
    onClose: () => void;
}

interface UpdateModal {
    modalType: ModalTypes.Change;
    _id: string;
    name: string;
    pickup_address: string;
    delivery_address: string;
    payload: number
    dimensions: {
        width: number;
        length: number;
        height: number;
    }
    open: boolean;
    onClose: () => void;
}

type LoadModalProps = UpdateModal | CreateModal

export default LoadModalProps;