import Sidebar from "../../Components/Sidebar/Sidebar";
import './Loads.scss';
import UserLoad from "../../Components/UserLoad/UserLoad";
import LoadModal from "../../Components/LoadModal/LoadModal";
import {useEffect, useMemo, useState, memo} from "react";
import {ILoad} from "../../Models/ILoad";
import {ModalTypes} from "../../Models/ModalTypes";
import {loadAPI} from '../../Servises/LoadServise';
import {useAppDispatch, useAppSelector} from "../../Hooks/redux";
import {checkIsAuth, getRole} from "../../Redux/reducers/auth/authSlice";
import Select from 'react-select';

function Loads() {

    const role = useAppSelector(getRole);
    const isAuth = useAppSelector(checkIsAuth);
    const [addLoad, setAddLoad] = useState(false);
    const appDispatch = useAppDispatch();


    const {data, refetch} = loadAPI.useFetchLoadsQuery({});
    const memoLoads = useMemo(() => data?.loads, [data?.loads]);
    const [loads, setLoads] = useState<ILoad[] | undefined>(memoLoads);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        setLoads(memoLoads);
    }, [memoLoads]);


    useEffect(() => {
        const polling = setInterval(() => {
            refetch();
        }, 2500);

        return () => {
            clearInterval(polling);
        };
    }, []);

    const [options, setOptions] = useState<any[]>([]);

    const userOptions = [
        {value: 'ALL', label: 'ALL'},
        {value: 'NEW', label: 'NEW'},
        {value: 'ASSIGNED', label: 'ASSIGNED'},
        {value: 'SHIPPED', label: 'SHIPPED'}];


    useEffect(() => {
        if (role === 'SHIPPER') setOptions(userOptions);
        if (role === 'DRIVER') setFilter('NEW');
    }, [role]);


    useEffect(() => {
        appDispatch(loadAPI.util.resetApiState());
    }, [isAuth]);


    const handleOpen = () => setAddLoad(true);
    const handleClose = () => setAddLoad(false);

    useEffect(() => {
        if (!filter) return;
        if (filter === 'ALL') return setLoads(data?.loads);
        setLoads(data?.loads.filter(load => load.status === filter));
    }, [filter, memoLoads]);


    return (
        <>
            {addLoad &&
                <LoadModal modalType={ModalTypes.Create} open={addLoad} onClose={handleClose}/>
            }
            <div className="layout-container">
                <Sidebar/>
                <div className="loads">
                    <div className="loads__head">
                        <h2 className="loads__title">Loads</h2>
                        {role === 'SHIPPER' &&
                            <button className="load_button" onClick={handleOpen}> Add load </button>
                        }
                        {role === 'SHIPPER' &&
                            <Select options={options} onChange={(e) => setFilter(e.value)}/>
                        }
                    </div>

                    <div className="loads__container">
                        {loads?.map(load => (
                            <UserLoad key={load._id} {...load}/>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loads;