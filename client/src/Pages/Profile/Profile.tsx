import './Profile.scss';
import Sidebar from "../../Components/Sidebar/Sidebar";
import {useAppDispatch, useAppSelector} from "../../Hooks/redux";
import {checkIsAuth, logout} from "../../Redux/reducers/auth/authSlice";
import {useEffect, useState} from "react";
import axios from "../../Utils/axios";
import {useNavigate} from "react-router-dom";
import {userAPI} from "../../Servises/UserServise";

function Profile() {

    const isAuth = useAppSelector(checkIsAuth);
    const {data: user} = userAPI.useFetchUserQuery({});
    const [changeUserPhoto, {}] = userAPI.useChangeUserPhotoMutation();
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) {
            navigate('/');
        }
    }, [isAuth])

    const [newImage, setNewImage] = useState('');

    const [isChangePassword, setIsChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    async function deleteAccount() {
        if (confirm('Are you sure?')) {
            try {
                await axios.delete('/users/me');

                appDispatch(logout());
            } catch (err) {
                alert(err.response.data.message)
            }
        }
    }

    useEffect(() =>
            () => {
                appDispatch(userAPI.util.resetApiState());
            }
        , []);


    async function changePassword() {
        if (!oldPassword) return setError('Provide all fields');
        if (!newPassword) return setError('Provide all fields');

        try {
            const {data} = await axios.patch('/users/me/password', {
                oldPassword,
                newPassword
            });
            alert(data.message);
            setError('');
        } catch (err) {
            setError(err.response.data.message);
        }
    }

    function changeImage() {
        try {
            const data = new FormData();
            data.append('image', newImage)

            changeUserPhoto(data);
            setNewImage('');
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="layout-container">
            <Sidebar/>
            <div className="profile">
                <div className="profile__container">
                    {user?.imgUrl ?
                        <div className="profile__picture">
                            <img src={`http://localhost:8080/${user.imgUrl}`} alt="#"/>
                        </div>
                        :
                        <div className="profile__img"></div>
                    }
                    <div className="profile__info">
                        <div className="profile__email">
                            {user?.email}
                        </div>
                        <div className="profile__role">
                            {user?.role}
                        </div>
                    </div>
                </div>
                <div className="profile__controls">
                    <div className="profile__drop">
                        <label className="profile__file" htmlFor="fileInput">
                            {!newImage ?
                                <span>Click to add photo</span>
                                :
                                <span>1 Image</span>
                            }
                            <input type="file" id="fileInput"
                                   accept="image/png, image/jpg, image/gif, image/jpeg"
                                   onChange={(e) => setNewImage(e.target?.files[0])}/>
                        </label>
                    </div>
                    {newImage &&
                        <button className="profile__button profile__button_change"
                                onClick={changeImage}>
                            Change profile picture
                        </button>
                    }
                    <button className="profile__button profile__button_change"
                            onClick={() => setIsChangePassword(isChangePassword => !isChangePassword)}>
                        Change password
                    </button>
                    <button className="profile__button profile__button_delete"
                            onClick={deleteAccount}>
                        Delete account
                    </button>
                </div>
                {isChangePassword &&
                    <form className="profile__form"
                          onSubmit={(e) => {
                              e.preventDefault();
                              changePassword();
                          }}>
                        <label className="profile__label">Old password</label>
                        <input className="profile__input" type="text"
                               onChange={(e) => setOldPassword(e.currentTarget.value)}/>

                        <label className="profile__label">New password</label>
                        <input className="profile__input" type="text"
                               onChange={(e) => setNewPassword(e.currentTarget.value)}/>

                        {error &&
                            <p className="profile__error">{error}</p>
                        }

                        <button className="profile__button profile__button_submit">Submit</button>
                    </form>
                }
            </div>
        </div>
    )
}

export default Profile;