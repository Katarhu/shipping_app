import {Modal} from "@mui/material";
import './TruckModal.scss';
import Select from "react-select";
import {useState} from "react";
import {truckAPI} from "../../Servises/TruckServise";
import TruckProps from '../../Models/ITruck';


function TruckModal({modalType, _id, truckType, open, onClose}: TruckProps) {
    const options = [{value: 'SPRINTER', label: 'Sprinter'},
        {value: 'SMALL STRAIGHT', label: 'Small Straight'},
        {value: 'LARGE STRAIGHT', label: 'Large Straight'}];

    const [selectedType, setSelectedType] = useState(truckType ?? 'SPRINTER');
    const [createTruck, {}] = truckAPI.useCreateTruckMutation();
    const [updateTruck, {}] = truckAPI.useUpdateTruckMutation();

    function handleSubmit() {
        switch (modalType) {
            case 'Create': {
                if (selectedType === truckType) return onClose();
                createTruck(selectedType);
                break;
            }
            case 'Change':
                updateTruck({_id, type: selectedType})
                break;
        }
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className="truck-modal">
                <h2 className="truck-modal__title">{`${modalType} truck`}</h2>
                <form className="truck-modal__form"
                      onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit();
                      }}>
                    <Select options={options}
                            onChange={(e) => setSelectedType(e!.value)}/>

                    <button className="truck-modal__button form__button">{modalType}</button>
                </form>
            </div>
        </Modal>
    )
}

export default TruckModal;