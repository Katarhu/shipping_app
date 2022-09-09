import './Chats.scss'
import Sidebar from "../../Components/Sidebar/Sidebar";
import UserContact from "../../Components/UserContact/UserContact";
import Chat from "../../Components/Chat/Chat";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {chatAPI} from "../../Servises/ChatServise";
import {IConversation} from "../../Models/IChat";
import {useAppSelector} from "../../Hooks/redux";
import {getId} from "../../Redux/reducers/auth/authSlice";


function Chats() {
    const [currentChat, setCurrentChat] = useState<string | null>('');
    const [conversations, setConversations] = useState<IConversation[] | undefined>([]);
    const _id = useAppSelector(getId);
    const {data, refetch} = chatAPI.useGetConversationsQuery({});

    function setChat(_id: string) {
        setCurrentChat(_id);
    }

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setCurrentChat(searchParams.get('id'));
    }, [searchParams]);

    useEffect(() => {
        setConversations(data);
    }, [data])

    useEffect(() => {
        refetch();
    }, [currentChat])


    return (
        <div className="layout-container">
            <Sidebar/>
            <div className="chats">
                <div className="chats__left">
                    <div className="chats__search">
                        <input className="chats__input" type="text" placeholder="Type email to search chats"/>
                    </div>
                    <div className="chats__contacts contacts">
                        <h2 className="contacts__title">Your chats</h2>
                        <div className="contacts__list">
                            {conversations?.map(conversation => {
                                const companionId = conversation.members.find(id => id !== _id);

                                return <UserContact
                                    key={conversation._id}
                                    conversationId={conversation._id}
                                    lastMessage={conversation.messages[conversation.messages.length - 1]}
                                    userId={companionId}
                                    setChat={setChat}/>
                            })}
                        </div>
                    </div>
                </div>
                <div className="chats__chat">
                    <Chat chatId={currentChat}/>
                </div>
            </div>
        </div>
    )
}

export default Chats;