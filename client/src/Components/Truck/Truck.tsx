import SmallStraightPhoto from '../../assets/SmallStraight.png';
import LargeStraightPhoto from '../../assets/LargeStraight.png';
import SprinterPhoto from '../../assets/Sprinter.png';
import './Truck.scss';
import {MdDoneOutline, MdModeEditOutline} from "react-icons/md";
import {AiTwotoneDelete} from "react-icons/ai";
import TruckModal from "../TruckModal/TruckModal";
import {useState} from "react";
import {truckAPI} from "../../Servises/TruckServise";
import {TruckTypes} from "../../Models/ITruck";

interface TruckProps {
    _id: string;
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

function Truck({_id, assigned_to, type, status, created_date, payload, dimensions}: TruckProps) {
    const TruckPhotos = {
        "SPRINTER": SprinterPhoto,
        "SMALL STRAIGHT": SmallStraightPhoto,
        "LARGE STRAIGHT": LargeStraightPhoto,
    }

    const [isEditLoad, setIsEditLoad] = useState(false);
    const [deleteTruck, {error: deleteError}] = truckAPI.useDeleteTruckMutation();
    const [assignTruck, {}] = truckAPI.useAssignTruckMutation();

    const closeModal = () => setIsEditLoad(false);
    const openModal = () => setIsEditLoad(true);

    function handleDelete() {
        if (confirm('Are you sure?')) {
            deleteTruck(_id);
        }
    }

    function handleAssign() {
        assignTruck(_id);
    }

    return (
        <>
            {isEditLoad &&
                <TruckModal _id={_id} modalType={TruckTypes.Change} truckType={type} open={isEditLoad}
                            onClose={closeModal}/>
            }
            <div className={`truck ${assigned_to ? 'truck__assigned' : ''}`}>
                <div className="truck__photo">
                    <img className="truck__img" src={TruckPhotos[type]} alt="#"/>
                </div>
                <div className="truck__info">
                    <div className="truck__head">
                        <div className="truck__type">{type}</div>
                        <div className="truck__created">{new Date(created_date).toLocaleDateString()}</div>
                    </div>
                    <div className={`truck__status truck__status_${status}`}>
                        {status ? status === 'OL' ? 'On load' : 'In service' : ''}
                    </div>
                    <div className="truck__dimensions">
                        <div><span className="text-bold">Payload</span>: {payload}</div>
                        <div><span className="text-bold">Width</span>: {dimensions.width}</div>
                        <div><span className="text-bold">Length</span>: {dimensions.length}</div>
                        <div><span className="text-bold">Height</span>: {dimensions.height}</div>
                    </div>
                </div>
                <div className="truck__buttons">
                    <button className="load__button" onClick={openModal}>
                        <MdModeEditOutline/>
                    </button>
                    {assigned_to === null &&
                        <button className="truck__button" onClick={handleAssign}>
                            <MdDoneOutline/>
                        </button>
                    }
                    <button className="load__button" onClick={handleDelete}>
                        <AiTwotoneDelete/>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Truck;