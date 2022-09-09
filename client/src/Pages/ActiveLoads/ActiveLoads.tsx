import './ActiveLoads.scss';
import Sidebar from "../../Components/Sidebar/Sidebar";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ILoad} from "../../Models/ILoad";
import axios from "../../Utils/axios";
import {ITruck} from "../../Models/ITruck";
import {RiMessage2Fill} from 'react-icons/ri';


function ActiveLoads() {
    const {id} = useParams();
    const [load, setLoad] = useState<ILoad | undefined>();
    const [truck, setTruck] = useState<ITruck | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios.get(`/loads/${id}/shipping_info`);

                setLoad(data.load);
                setTruck(data.truck);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    async function openMessenger() {
        try {
            const {data} = await axios.post('/chats', {
                companionId: truck?.assigned_to
            });

            navigate(`/chats?id=${data.chatId}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="layout-container">
            <Sidebar/>
            {load ?
                <div className="loads">
                    <div className="load" style={{display: 'flex'}}>
                        <div className="load__col" style={{flex: '1 1 auto'}}>
                            <div className="load__info">
                                <div className="load__head">
                                    <span className={`load__status_${load?.status}`}></span>
                                    <span className="load__status">{load?.status}</span>
                                    <span
                                        className="load__date">{new Date(load?.created_date).toLocaleDateString()}</span>
                                </div>
                                <div className="load__name">{load?.name}</div>
                                <div className="load__state">{load?.state}</div>
                                <div className="load__pickup">
                                    <span className="text-bold">Pickup Address:</span> {load?.pickup_address}
                                </div>
                                <div className="load__delivery">
                                    <span className="text-bold">Delivery address</span>: {load?.delivery_address}
                                </div>
                                <div className="load__dimensions">
                                    <div><span className="text-bold">Payload</span>: {load?.payload}</div>
                                    <div><span className="text-bold">Width</span>: {load?.dimensions.width}</div>
                                    <div><span className="text-bold">Length</span>: {load?.dimensions.length}</div>
                                    <div><span className="text-bold">Height</span>: {load?.dimensions.height}</div>
                                </div>
                            </div>
                            {truck &&
                                <div className="truck__info" style={{margin: '25px 0 0 0'}}>
                                    <h2 style={{margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 'bold'}}>Assigned
                                        to truck:</h2>
                                    <div className="truck__head">
                                        <div className="truck__type" style={{fontSize: '1rem'}}>{truck?.type}</div>
                                        <div
                                            className="truck__created">{new Date(truck?.created_date || '').toLocaleDateString()}</div>
                                    </div>
                                    <div style={{margin: '0 0 10px 0'}}>Driver id: {truck?.assigned_to}</div>
                                    <div className="truck__dimensions">
                                        <div><span className="text-bold">Payload</span>: {truck?.payload}</div>
                                        <div><span className="text-bold">Width</span>: {truck?.dimensions.width}</div>
                                        <div><span className="text-bold">Length</span>: {truck?.dimensions.length}</div>
                                        <div><span className="text-bold">Height</span>: {truck?.dimensions.height}</div>
                                    </div>
                                </div>}
                        </div>
                        <div className="load__buttons">
                            <button className="load__button" onClick={openMessenger}>
                                <RiMessage2Fill/>
                            </button>
                        </div>
                    </div>
                </div>
                :
                <div style={{fontSize: '1.5rem', padding: '25px 50px'}}>Sorry, error occurred</div>
            }
        </div>
    )
}

export default ActiveLoads