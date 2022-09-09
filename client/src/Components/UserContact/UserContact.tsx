import './UserContact.scss';
import img from '../../assets/Sprinter.png';
import {useNavigate} from "react-router-dom";
import {memo, useEffect, useState} from "react";
import {IMessage} from "../../Models/IChat";
import axios from "../../Utils/axios";

interface UserContactProps {
    setChat: (_id: string) => void;
    conversationId?: string
    userId?: string
    lastMessage: IMessage;
}

function UserContact({setChat, userId, conversationId, lastMessage}: UserContactProps) {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [img, setImg] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios.get(`/users/${userId}`);

                setEmail(data.email);
                setImg(data.imgUrl);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);


    return (
        <div className="contact" onClick={() => navigate(`/chats?id=${conversationId}`)}>
            {img ?
                <div className="contact__photo">
                    <img src={`http://localhost:8080/${img}`} alt="#"/>
                </div>
                :
                <div className="profile__img"></div>
            }
            <div className="contact__main">
                <div className="contact__head">
                    <div className="contact__email">{email}</div>
                    <div className="contact__date">{lastMessage?.created_at}</div>
                </div>
                {/*<div className="contact__message">*/}
                {/*    {lastMessage?.text ?*/}
                {/*        lastMessage.text?.substring(0, 100) ?? '' + '...'*/}
                {/*        :*/}
                {/*        ''*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default UserContact;