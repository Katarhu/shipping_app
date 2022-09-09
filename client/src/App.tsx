import {Route, Routes} from "react-router-dom";
import Layout from './Layout/Layout';
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import {useAppDispatch} from "./Hooks/redux";
import {useEffect, useState} from "react";
import {authUser} from "./Redux/reducers/auth/actionCreators";
import {BounceLoader} from "react-spinners";
import './App.scss';
import Loads from "./Pages/Loads/Loads";
import Main from "./Pages/Main/Main";
import Profile from "./Pages/Profile/Profile";
import Trucks from "./Pages/Trucks/Trucks";
import AssignedLoads from "./Pages/AssignedLoad/AssignedLoad";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ActiveLoads from "./Pages/ActiveLoads/ActiveLoads";
import Chats from "./Pages/Chats/Chats";

function App() {

    const dispatch = useAppDispatch();
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        dispatch(authUser());
    }, []);

    return (
        <>
            {
                !pageLoaded &&
                <div className="spinner__container"
                     style={{animation: "fadeout 1s 1s ease forwards"}}
                     onAnimationEnd={() => setPageLoaded(true)}>
                    <BounceLoader size={100}/>
                </div>
            }
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/main" element={<Main/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/loads/:id" element={<ActiveLoads/>}/>
                    <Route path="/chats" element={<Chats/>}/>
                    <Route path="/forgot" element={<ForgotPassword/>}/>
                    <Route path="/loads" element={<Loads/>}/>
                    <Route path="/trucks" element={<Trucks/>}/>
                    <Route path="/assigned-loads" element={<AssignedLoads/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </Layout>

        </>
    )
}

export default App;
