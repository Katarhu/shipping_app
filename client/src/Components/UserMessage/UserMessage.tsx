import './UserMessage.scss';
import img from '../../assets/Sprinter.png';
import {memo} from "react";

interface UserMessageProps {
    message: string;
    who: string;
    userImg?: string;
    companionImg?: string;
    created_date?: string;
}

function UserMessage({userImg, created_date, companionImg, message, who = 'me'}: UserMessageProps) {

    return (
        <div className={`message message__${who}`}>
            {who === 'companion' ?
                <>
                    {companionImg ?
                        <div className="message__photo">
                            <img src={`http://localhost:8080/${companionImg}`} alt="#"/>
                        </div>
                        :
                        <div className="profile__img"></div>
                    }
                </>
                :
                <>
                    {userImg ?
                        <div className="message__photo">
                            <img src={`http://localhost:8080/${userImg}`} alt="#"/>
                        </div>
                        :
                        <div className="profile__img"></div>
                    }
                </>
            }
            <div className="message__body">
                <div className="message__text">{message}</div>
                <div className="message__date">{created_date}</div>
            </div>
        </div>
    )
}

export default memo(UserMessage);