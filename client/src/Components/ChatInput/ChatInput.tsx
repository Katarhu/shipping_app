import {IoMdSend} from "react-icons/io";
import {useState} from "react";

interface ChatInputProps {
    sendMessage: (text: string) => void;
}

function ChatInput({sendMessage}: ChatInputProps) {
    const [message, setMessage] = useState('');

    function handleKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            setMessage('');
            sendMessage(message);
        }
    }

    return (
        <div className="chat__bottom" onKeyPress={handleKey}>
            <input className="chat__input" type="text"
                   placeholder="Type your message"
                   onChange={(e) => setMessage(e.currentTarget.value)}
                   value={message}/>
            <button className="chat__button"
                    onClick={() => {
                        setMessage('');
                        sendMessage(message);
                    }}>
                <IoMdSend/>
            </button>
        </div>
    )
}

export default ChatInput;