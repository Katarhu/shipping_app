import './Home.scss';
import {Link, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../Hooks/redux";
import {checkIsAuth} from "../../Redux/reducers/auth/authSlice";
import {useEffect} from "react";

function Home() {
    const navigate = useNavigate();
    const isAuth = useAppSelector(checkIsAuth);

    useEffect(() => {
        if (isAuth) {
            navigate('/main')
        }
    }, [isAuth])

    return (
        <div className="home">
            <div className="home__container">
                <h1 className="home__title">Welcome to HW-3, to continue you have to <Link
                    to="/login">login</Link> or <Link
                    to="/register">register</Link></h1>
            </div>
        </div>
    )
}

export default Home;