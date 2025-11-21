import './ai-assistant.css'
import RobabaleIcon from '../../assets/mascot.png'
import { useEffect, useState } from 'react';
import { sendChatMessage } from '../../scripts/ai';

export default function AIAssistant(){
    
    let chat = document.querySelector('.ai-chat-container');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function sendMessage(){
        if (!message || isLoading) {
            return;
        }

        const now = new Date().toLocaleString();
        const userMessage = message;

        setMessages(prev =>{
            return [...prev,{
                message: userMessage,
                date_sent: now,
                from: 'user'
            }]
        })

        const input = document.getElementById('chat-input');
        if (input) {
            input.disabled = true;
        }
        
        setError(null);
        setIsLoading(true);

        const stop = waitLang();

        try {
            const reply = await sendChatMessage(userMessage);
            const replyTime = new Date().toLocaleString();

            setMessages(prev => {
                return [...prev, {
                    message: reply,
                    date_sent: replyTime,
                    from: 'assistant'
                }]
            })
        } catch (err) {
            console.error(err);
            setError('Something went wrong while contacting the AI.');
        } finally {
            stop();
            setIsLoading(false);
            if (input) {
                input.disabled = false;
                input.value = "";
            }
            setMessage('');
        }

    }

    function waitLang(){
        const chats = document.querySelector('.chats-container');
        if (!chats) {
            return () => {};
        }

        const typingContainer = document.createElement('div');
        typingContainer.className = 'typing-container'; 
        
        for(let i = 0; i < 3; i++){
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            dot.style.animationDelay = `${i * 0.15}s`; 
            typingContainer.appendChild(dot);
        }
        chats.appendChild(typingContainer);

        const stop = () => {
            if (chats.contains(typingContainer)) {
                chats.removeChild(typingContainer);
            }
        }
        return stop;
    }

    useEffect(()=>{
        chat = document.querySelector('.ai-chat-container');
    }, [])

    function showChat(){
        if(!chat){
            console.log('mali');
            return
        }
        if(chat.style.display == 'flex'){
            closeChat();
        }else{
            chat.style.display = 'flex'
        }
    }

    function closeChat(){
        chat.style.display = 'none'
        
    }
    
    return(
        <div className="ai-assistant-container">
            <div className="ai-chat-container">
                <div className="chat-header">
                    <img src={RobabaleIcon} alt="Robable Icon" />
                    <p className='chat-header-title'>Robable Chat Assistant</p>
                    <i className="fas fa-window-minimize minimize-icon" onClick={closeChat}></i>
                </div>
                    <div className="chats-container">
                        {messages && messages.map((currMessage)=>{
                            const isUser = currMessage.from === 'user';
                            const containerClass = isUser ? 'user-message-container' : 'ai-message-container';
                            const messageClass = isUser ? 'user-message' : 'ai-message';
                            return <div key={currMessage.date_sent + currMessage.from} className={containerClass}>
                                        <p className={messageClass}>{currMessage.message}</p>
                                        <p className='message-date'>{currMessage.date_sent}</p>
                                    </div>
                        })}
                        {error && (
                            <div className="error-message-container">
                                <p className='message-error'>{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-container">
                        <input
                            type="text"
                            className='chat-input'
                            id='chat-input'
                            placeholder='Ask me anything'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                        />
                        <i className="ti ti-send-2 send-icon" onClick={() => sendMessage()}></i>
                    </div>

            </div>
            <div className="ai-assistant-button" onClick={showChat}>
                <img src={RobabaleIcon} alt=""  className='ai-assistant-icon'/>
            </div>
        </div>
    )
}