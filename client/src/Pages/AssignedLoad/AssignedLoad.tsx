import './AssignedLoad.scss';
import Sidebar from "../../Components/Sidebar/Sidebar";
import {loadAPI} from "../../Servises/LoadServise";
import {RiMessage2Fill} from "react-icons/ri";
import {useEffect, useState} from "react";
import axios from "../../Utils/axios";
import {ILoad} from "../../Models/ILoad";
import {useNavigate} from "react-router-dom";
import {MdNextWeek} from "react-icons/md";

function AssignedLoad() {
    const {data} = loadAPI.useGetActiveLoadQuery();
    const [proceedLoad, {}] = loadAPI.useProceedLoadMutation();
    const [load, setLoad] = useState<ILoad | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setLoad(data.load);
        }
    }, [data])

    async function openMessenger() {
        try {
            const {data} = await axios.post('/chats', {
                companionId: load?.created_by
            });

            navigate(`/chats?id=${data.chatId}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="layout-container">
            <Sidebar/>
            <div className="assigned">
                <h2 className="assigned__title">Assigned load</h2>
                <div className="assigned__container">
                    {load ?
                        <div className="load assigned__load">
                            <div className="load__info">
                                <div className="load__head">
                                    <span className={`load__status_${load?.status}`}></span>
                                    <span className="load__status">{load?.status}</span>
                                    <span
                                        className="load__date">{new Date(load?.created_date || '').toLocaleDateString()}</span>
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
                            <div className="load__buttons">
                                <button className="load__button" onClick={openMessenger}>
                                    <RiMessage2Fill/>
                                </button>
                                <button className="load__button"
                                        onClick={() => proceedLoad()}>
                                    <MdNextWeek/>
                                </button>
                            </div>
                        </div>
                        :
                        <h2>There is no assigned loads</h2>
                    }
                </div>
            </div>
        </div>
    )
}

export default AssignedLoad;