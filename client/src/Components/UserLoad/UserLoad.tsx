import './UserLoad.scss';
import {MdDoneOutline, MdModeEditOutline, MdNextWeek} from 'react-icons/md';
import {AiFillEye, AiOutlineEye, AiTwotoneDelete} from 'react-icons/ai';
import {BsInfoCircleFill} from 'react-icons/bs';
import {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import LoadModal from "../LoadModal/LoadModal";
import {useAppSelector} from "../../Hooks/redux";
import {getRole} from "../../Redux/reducers/auth/authSlice";
import {loadAPI} from "../../Servises/LoadServise";
import {ModalTypes} from "../../Models/ModalTypes";
import {ILoad} from "../../Models/ILoad";
import axios from "../../Utils/axios";


function UserLoad({
                      _id,
                      status,
                      state,
                      name,
                      payload,
                      pickup_address,
                      delivery_address,
                      dimensions,
                      created_date,
                      logs
                  }: ILoad) {

    const role = useAppSelector(getRole);
    const [deleteLoad, {}] = loadAPI.useDeleteLoadMutation();
    const [postLoad, {data, error}] = loadAPI.usePostLoadMutation();

    const [isLogsShowed, showIsLogsShowed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    useEffect(() => {
        if (error) {
            // @ts-ignore
            alert(error?.data.message);
        }
    }, [error, data]);

    return (
        <>
            {showModal &&
                <LoadModal
                    modalType={ModalTypes.Change}
                    _id={_id} name={name} payload={payload} pickup_address={pickup_address}
                    delivery_address={delivery_address} dimensions={dimensions}
                    open={showModal} onClose={handleClose}/>
            }
            <div className="load">
                <div className="load__row">
                    <div className="load__info">
                        <div className="load__head">
                            <span className={`load__status_${status}`}></span>
                            <span className="load__status">{status}</span>
                            <span className="load__date">{new Date(created_date).toLocaleDateString()}</span>
                        </div>
                        <div className="load__name">{name}</div>
                        <div className="load__state">{state}</div>
                        <div className="load__pickup">
                            <span className="text-bold">Pickup Address:</span> {pickup_address}
                        </div>
                        <div className="load__delivery">
                            <span className="text-bold">Delivery address</span>: {delivery_address}
                        </div>
                        <div className="load__dimensions">
                            <div><span className="text-bold">Payload</span>: {payload}</div>
                            <div><span className="text-bold">Width</span>: {dimensions.width}</div>
                            <div><span className="text-bold">Length</span>: {dimensions.length}</div>
                            <div><span className="text-bold">Height</span>: {dimensions.height}</div>
                        </div>
                    </div>
                    <div className="load__buttons">
                        {role === 'SHIPPER' &&
                            <>
                                {status === 'NEW' &&
                                    <button className="load__button"
                                            onClick={() => postLoad(_id)}>
                                        <MdDoneOutline/>
                                    </button>
                                }
                                {status !== 'NEW' && status !== 'SHIPPED' &&
                                    <Link to={`/loads/${_id}`}
                                          className="load__button">
                                        <BsInfoCircleFill/>
                                    </Link>
                                }
                                {status === 'NEW' &&
                                    <button className="load__button"
                                            onClick={handleOpen}>
                                        <MdModeEditOutline/>
                                    </button>
                                }
                                {!!logs.length &&
                                    <button className="load__button"
                                            onClick={() => showIsLogsShowed(isLogsShowed => !isLogsShowed)}>
                                        {isLogsShowed ? <AiOutlineEye/> : <AiFillEye/>}
                                    </button>
                                }
                                {(status === 'NEW' || status === 'SHIPPED') &&
                                    <button className="load__button"
                                            onClick={() => deleteLoad(_id)}>
                                        <AiTwotoneDelete/>
                                    </button>
                                }
                            </>
                        }
                    </div>
                </div>

                {isLogsShowed && <div className="load__logs">
                    {logs.map(log => (
                        <div key={Math.random().toString(36)} className="load__log log">
                            <div
                                className="log__date">{log.time}</div>
                            <div className="log__message">{log.message}</div>
                        </div>
                    ))}
                </div>}
            </div>
        </>
    )
}

export default UserLoad;