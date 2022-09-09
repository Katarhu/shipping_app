import {RefObject, useRef, useEffect, useState} from 'react';
import './Login.scss';
import '../Form.scss';
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../Hooks/redux";
import {checkIsAuth, clearAppError} from "../../Redux/reducers/auth/authSlice";
import {loginUser} from "../../Redux/reducers/auth/actionCreators";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const appDispatch = useAppDispatch();
    const isAuth = useAppSelector(checkIsAuth);
    const navigate = useNavigate();
    const {error: appError} = useAppSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        return () => {
            appDispatch(clearAppError());
        }
    }, []);

    function checkInput() {
        if (!email || !password) {
            return setError('Wrong input');
        }

        appDispatch(loginUser({email, password}));
    }

    useEffect(() => {
        if (appError) {
            setError(appError);
        }
    }, [appError]);

    useEffect(() => setError(''), [email, password]);


    useEffect(() => {
        if (isAuth) {
            navigate('/main');
        }
    }, [isAuth]);


    return (
        <div className="login">
            <form className="login__form form" onSubmit={(e) => {
                e.preventDefault();
                checkInput();
            }}>
                <h2 className="form__title">Log in</h2>

                <fieldset className="form__field">
                    <input className="form__input" id="email-input" type="text" placeholder=" "
                           onChange={(e) =>
                               setEmail(e.currentTarget.value)
                           }/>
                    <label className="form__label" htmlFor="email-input">Email</label>
                </fieldset>

                <fieldset className="form__field">
                    <input className="form__input form__password"
                           id="pass-input"
                           type={showPassword ? 'text' : 'password'}
                           placeholder=" "
                           onChange={(e) =>
                               setPassword(e.currentTarget.value)
                           }/>
                    <label className="form__label" htmlFor="pass-input">Password</label>
                    <label className="form__show-pass"
                           onClick={() => setShowPassword(o => !o)}>👁</label>
                </fieldset>

                {error &&
                    <p className="form__error">{error}</p>
                }

                <input className="form__button" type="submit" value="Login"/>
                <Link className="form__link" to="/register">Don't have an account?<br/>Create one</Link>
                <Link className="form__link" to="/forgot">Forgot password?</Link>
            </form>
        </div>
    )
}

export default Login;