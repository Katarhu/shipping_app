import './Chat.scss';
import {memo, useRef} from 'react';
import {AiTwotoneDelete} from 'react-icons/ai';
import img from '../../assets/Sprinter.png';
import UserMessage from "../UserMessage/UserMessage";
import {useEffect, useState} from "react";
import {chatAPI} from "../../Servises/ChatServise";
import {IConversation, IMessage} from "../../Models/IChat";
import axios from "../../Utils/axios";
import {useAppSelector} from "../../Hooks/redux";
import {getId} from "../../Redux/reducers/auth/authSlice";
import ChatInput from "../ChatInput/ChatInput";
import {io} from 'socket.io-client';
import {useNavigate} from "react-router-dom";

interface ChatProps {
    chatId: string | null
}

function Chat({chatId}: ChatProps) {
    const [messages, setMessages] = useState<IMessage[] | undefined>();
    const _id = useAppSelector(getId);
    const {data} = chatAPI.useGetConversationsQuery({});
    const [deleteChat] = chatAPI.useDeleteChatMutation();
    const navigate = useNavigate();
    const [current, setCurrent] = useState<IConversation | undefined>();
    const [userImage, setUserImage] = useState('');
    const [companionImage, setCompanionImage] = useState('');
    const [companionEmail, setCompanionEmail] = useState('');
    const socket = useRef<any>();

    useEffect(() => {
        socket.current = io("ws://localhost:3000");

        socket.current.emit('connect-to', chatId);

        socket.current.on('receive-message', (data: IMessage) => {
            setMessages(messages => [data, ...messages]);
        });

    }, [chatId]);

    useEffect(() => () => {
        socket.current = null
    }, []);

    useEffect(() => {
        setCurrent(data?.find(converstaion => converstaion._id === chatId));
    }, [data, chatId]);

    useEffect(() => {
        if (current) {
            setMessages([...current?.messages].reverse());
        }
    }, [current]);

    useEffect(() => {
        (async () => {
            try {
                if (!current) return;

                const companionId = current?.members.find(id => id !== _id);

                const {data: companionData} = await axios.get(`/users/${companionId}`);
                const {data: userData} = await axios.get(`/users/${_id}`);

                setUserImage(userData.imgUrl);
                setCompanionImage(companionData.imgUrl);
                setCompanionEmail(companionData.email);

            } catch (err) {
                console.log(err);
            }
        })();
    }, [current])

    function sendMessage(text: string) {
        socket.current.emit('send-message', text, _id, chatId);

        const message = {
            sender: _id,
            text,
            created_date: new Date().toLocaleDateString()
        }
        setMessages(messages => [message, ...messages]);

    }

    function deleteHandler() {
        deleteChat(chatId);
        navigate('/chats');
    }

    return (
        <div className="chat">
            {chatId ?
                <>
                    <div className="chat__head">
                        {companionImage ?
                            <div className="chat__head-img">
                                <img src={`http://localhost:8080/${companionImage}`} alt=""/>
                            </div>
                            :
                            <div className="profile__img"></div>
                        }
                        <div className="chat__head-title">{companionEmail}</div>
                        <button className="chat__head-button"
                                onClick={deleteHandler}>
                            <AiTwotoneDelete/>
                        </button>
                    </div>
                    <div className="chat__body">
                        {messages?.map(message => (
                            <UserMessage
                                key={Math.random().toString(36)}
                                message={message.text}
                                userImg={userImage}
                                companionImg={companionImage}
                                created_date={message.created_date}
                                who={message.sender === _id ? '' : 'companion'}/>
                        ))}
                    </div>
                    <ChatInput sendMessage={sendMessage}/>
                </>
                :
                <h2 className="chat__title">Choose chat to start conversation</h2>
            }
        </div>
    )
}

export default memo(Chat);