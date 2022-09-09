import './LoadModal.scss';
import {Modal} from "@mui/material";
import {useEffect, useState} from "react";
import {loadAPI} from "../../Servises/LoadServise";
import LoadModalProps from '../../Models/ModalTypes';

function LoadModal({
                       modalType,
                       _id,
                       name = '',
                       payload = 100,
                       pickup_address = '',
                       delivery_address = '',
                       dimensions = {
                           width: 0,
                           length: 0,
                           height: 0,
                       },
                       open,
                       onClose
                   }: LoadModalProps) {

    const [loadName, setName] = useState(name || '');
    const [loadPayload, setPayload] = useState(payload || 100);
    const [pickupAddress, setPickupAddress] = useState(pickup_address || '');
    const [deliveryAddress, setDeliveryAddress] = useState(delivery_address || '');
    const [loadDimensions, setDimensions] = useState(dimensions || {});
    const [error, setError] = useState('');

    useEffect(() => setError(''), [loadName, loadPayload, pickupAddress, deliveryAddress, loadDimensions]);

    const [createLoad, {}] = loadAPI.useCreateLoadMutation();
    const [changeLoad, {}] = loadAPI.useUpdateLoadMutation();

    function handleInput() {
        if (!loadName) return setError('Please enter load name');
        if (!pickupAddress) return setError('Please enter pickup address');
        if (!deliveryAddress) return setError('Please enter delivery address');
        if (!loadPayload
            || isNaN(loadPayload)
            || (loadPayload) <= 0) return setError('Incorrect value for payload');
        if (!loadDimensions.width
            || isNaN(loadDimensions.width)
            || (loadDimensions.width) <= 0) return setError('Incorrect value for width');
        if (!loadDimensions.length
            || isNaN(loadDimensions.length)
            || (loadDimensions.length) <= 0) return setError('Incorrect value for length');
        if (!loadDimensions.height
            || isNaN(loadDimensions.height)
            || (loadDimensions.height) <= 0) return setError('Incorrect value for height');


        switch (modalType) {
            case 'Create': {
                onClose();
                return createLoad({
                    name: loadName,
                    payload: loadPayload,
                    pickup_address: pickupAddress,
                    delivery_address: deliveryAddress,
                    dimensions: loadDimensions
                });
            }
            case 'Change':
                onClose();
                return changeLoad({
                    _id,
                    name: loadName,
                    payload: loadPayload,
                    pickup_address: pickupAddress,
                    delivery_address: deliveryAddress,
                    dimensions: loadDimensions
                });
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="load-modal">
                <h2 className="load-modal__title">{`${modalType} load`}</h2>

                <form className="load-modal__form"
                      onSubmit={(e) => {
                          e.preventDefault();
                          handleInput()
                      }}>
                    <fieldset className="load-modal__field">
                        <label className="load-modal__label" htmlFor="#">Name</label>
                        <input className="load-modal__input" type="text"
                               onChange={(e) => setName(e.currentTarget.value)}/>
                    </fieldset>
                    <fieldset className="load-modal__field">
                        <label className="load-modal__label" htmlFor="#">Pickup address</label>
                        <input className="load-modal__input" type="text"
                               onChange={(e) => setPickupAddress(e.currentTarget.value)}/>
                    </fieldset>
                    <fieldset className="load-modal__field">
                        <label className="load-modal__label" htmlFor="#">Delivery address</label>
                        <input className="load-modal__input" type="text"
                               onChange={(e) => setDeliveryAddress(e.currentTarget.value)}/>
                    </fieldset>

                    <fieldset className="load-modal__field load-modal__payload">
                        <label className="load-modal__label" htmlFor="#">Payload</label>
                        <input className="load-modal__input" type="text"
                               onChange={(e) => setPayload(+e.currentTarget.value)}/>
                    </fieldset>

                    <div className="load-modal__dimensions">
                        <fieldset className="load-modal__dimension">
                            <label className="load-modal__label" htmlFor="#">Width</label>
                            <input className="load-modal__input" type="text"
                                   onChange={(e) => setDimensions(i => ({...i, width: +e.currentTarget.value}))}/>
                        </fieldset>
                        <fieldset className="load-modal__dimension">
                            <label className="load-modal__label" htmlFor="#">Length</label>
                            <input className="load-modal__input" type="text"
                                   onChange={(e) => setDimensions(i => ({...i, length: +e.currentTarget.value}))}/>
                        </fieldset>
                        <fieldset className="load-modal__dimension">
                            <label className="load-modal__label" htmlFor="#">Height</label>
                            <input className="load-modal__input" type="text"
                                   onChange={(e) => setDimensions(i => ({...i, height: +e.currentTarget.value}))}/>
                        </fieldset>
                    </div>
                    {error &&
                        <p className="load-modal__error">{error}</p>
                    }
                    <button className="form__button">Submit</button>
                </form>
            </div>
        </Modal>
    )
}

export default LoadModal;