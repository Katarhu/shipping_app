import './ForgotPassword.scss';
import {useState} from "react";
import axios from "../../Utils/axios";
import {useNavigate} from "react-router-dom";

function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function submitHandler() {
        if (!email) {
            setError('Please, fill email');
        }

        try {
            const response = await axios.post('/auth/forgot_password', {
                email
            });

            setError('');
            navigate('/login');
        } catch (err) {
            setError(err?.response.data.message)
        }
    }

    return (
        <div className="forgot">
            <form className="form"
                  onSubmit={(e) => {
                      e.preventDefault();
                      submitHandler();
                  }}>
                <h2 className="form__title">Forgot password</h2>

                <fieldset className="form__field">
                    <input className="form__input" id="email-input" type="text" placeholder=" "
                           onChange={(e) => setEmail(e.currentTarget.value)}/>
                    <label className="form__label" htmlFor="email-input">Email</label>
                </fieldset>

                {error &&
                    <p className="form__error">{error}</p>
                }

                <button className="form__button">Send me new password</button>
            </form>
        </div>
    )
}

export default ForgotPassword;