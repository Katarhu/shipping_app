import './Register.scss';
import '../Form.scss';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../Hooks/redux";
import {registerUser} from "../../Redux/reducers/auth/actionCreators";
import {checkIsAuth, clearAppError} from "../../Redux/reducers/auth/authSlice";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

    const appDispatch = useAppDispatch();
    const isAuth = useAppSelector(checkIsAuth);
    const navigate = useNavigate();
    const {error: appError} = useAppSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        return () => {
            appDispatch(clearAppError());
        }
    }, []);

    useEffect(() => {
        if (isAuth) {
            navigate('/main');
        }
    }, [isAuth]);

    useEffect(() => setError(''), [email, password, passwordRepeat, role]);


    function isInputValid() {

        if (!email) return setError('Please enter email');
        if (!password) return setError('Please enter password');
        if (!passwordRepeat) return setError('Please repeat your password');
        if (!role) return setError('Please, choose role');

        if (password !== passwordRepeat) {
            return setError('Passwords doesn\'t match');
        }

        appDispatch(registerUser({
            email,
            password,
            role
        }));

        if (appError) {
            setError(appError);
            return;
        }
    }

    return (
        <div className="register">
            <form className="register__form form" onSubmit={(e) => {
                e.preventDefault();
                isInputValid();
            }}>
                <h2 className="form__title">Register</h2>

                <fieldset className="form__field">
                    <input className="form__input"
                           id="username-input"
                           type="text"
                           placeholder=" "
                           onChange={(e) => {
                               setEmail(e.currentTarget.value)
                           }}/>
                    <label className="form__label" htmlFor="username-input">Email</label>
                </fieldset>

                <fieldset className="form__field">
                    <input className="form__input form__password"
                           id="pass-input"
                           type={showPassword ? 'text' : 'password'}
                           placeholder=" "
                           onChange={(e) => {
                               setPassword(e.currentTarget.value)
                           }}/>
                    <label className="form__label" htmlFor="pass-input">Password</label>
                    <label className="form__show-pass"
                           onClick={() => setShowPassword(i => !i)}>👁</label>
                </fieldset>

                <fieldset className="form__field">
                    <input className="form__input form__password"
                           id="pass-rep-input"
                           type={showPasswordRepeat ? 'text' : 'password'}
                           placeholder=" "
                           onChange={(e) => {
                               setPasswordRepeat(e.currentTarget.value);
                           }}/>
                    <label className="form__label" htmlFor="pass-rep-input">Repeat password</label>
                    <label className="form__show-pass"
                           onClick={() => setShowPasswordRepeat(i => !i)}>👁</label>
                </fieldset>

                <fieldset className="form__choose">
                    <input id="radio1" type="radio" value="SHIPPER" name="roleRadio"
                           onClick={(e) => setRole(e.currentTarget.value)}/>
                    <label className="form__radio" htmlFor="radio1">Shipper</label>

                    <input id="radio2" type="radio" value="DRIVER" name="roleRadio"
                           onClick={(e) => setRole(e.currentTarget.value)}/>
                    <label className="form__radio" htmlFor="radio2">Driver</label>
                </fieldset>

                {error &&
                    <p className="form__error">{error}</p>
                }

                <input className="form__button"
                       type="submit"
                       value="Register"/>

                <Link className="form__link" to="/login">Already have an account? <br/> Log in</Link>
            </form>
        </div>
    )
}

export default Register;