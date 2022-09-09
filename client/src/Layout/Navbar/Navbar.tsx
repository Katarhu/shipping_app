import {Link, useNavigate} from 'react-router-dom';
import './Navbar.scss';
import {checkIsAuth, logout} from "../../Redux/reducers/auth/authSlice";
import {useAppDispatch, useAppSelector} from "../../Hooks/redux";
import Hamburger from 'hamburger-react';
import {useNavbar} from "../../Context/NavbarContext";
import {memo} from "react";

function Navbar() {
    const isAuth = useAppSelector(checkIsAuth);
    const {user} = useAppSelector(state => state.auth);
    const {isNavbarOpen, toggleNavbar} = useNavbar();

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    function logoutHandler() {
        appDispatch(logout());
        window.localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <nav className="nav">
            <div className="nav__logo">
                {isAuth ?
                    <Hamburger
                        size={20}
                        toggled={isNavbarOpen}
                        toggle={toggleNavbar}/> :
                    <Link className="nav__link" to="/">HW_3</Link>
                }
            </div>
            {!isAuth ?
                <div className="nav__buttons">
                    <Link className="nav__btn nav__login" to="/login">Login</Link>
                    <Link className="nav__btn nav__register" to="/register">Register</Link>
                </div> :
                <>
                    <p className="nav__welcome">Welcome, {user!?.email}!</p>
                    <button className="nav__btn nav__register" onClick={logoutHandler}>Logout</button>
                </>
            }
        </nav>
    )
}

export default memo(Navbar);