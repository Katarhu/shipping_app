import './Trucks.scss';
import Sidebar from "../../Components/Sidebar/Sidebar";
import Select from "react-select";
import {useEffect, useState} from "react";
import TruckModal from "../../Components/TruckModal/TruckModal";
import {truckAPI} from "../../Servises/TruckServise";
import {ITruck} from "../../Models/ITruck";
import Truck from "../../Components/Truck/Truck";
import {useAppDispatch, useAppSelector} from "../../Hooks/redux";
import {checkIsAuth} from "../../Redux/reducers/auth/authSlice";

function Trucks() {
    const options = [
        {value: 'ALL', label: 'All'},
        {value: 'SPRINTER', label: 'Sprinter'},
        {value: 'SMALL STRAIGHT', label: 'Small Straight'},
        {value: 'LARGE STRAIGHT', label: 'Large Straight'},]

    const [addTruck, setAddTruck] = useState(false);
    const isAuth = useAppSelector(checkIsAuth);
    const appDispatch = useAppDispatch();
    const {data} = truckAPI.useFetchTrucksQuery({});
    const [trucks, setTrucks] = useState<ITruck[] | undefined>([]);

    useEffect(() => {
        appDispatch(truckAPI.util.resetApiState());
    }, [isAuth]);

    useEffect(() => {
        setTrucks(data?.trucks);
    }, [data?.trucks]);

    function filterTrucks(filter: string) {
        if (filter === "ALL") return setTrucks(data?.trucks);
        setTrucks(data?.trucks.filter(truck => truck.type === filter));
    }

    const handleOpen = () => setAddTruck(true);
    const handleClose = () => setAddTruck(false);

    return (
        <>
            {addTruck &&
                <TruckModal modalType={'Create'} open={addTruck} onClose={handleClose}/>
            }
            <div className="layout-container">
                <Sidebar/>
                <div className="trucks">
                    <div className="trucks__head">
                        <h2 className="loads__title">My trucks</h2>
                        <button className="load_button" onClick={handleOpen}> Add truck</button>
                        <Select options={options} onChange={(e) => filterTrucks(e!.value)}/>
                    </div>

                    <div className="trucks__container">
                        {
                            trucks?.map(truck => (
                                <Truck key={truck._id} {...truck} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Trucks;