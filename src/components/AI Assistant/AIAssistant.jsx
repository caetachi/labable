import './ai-assistant.css'
import RobabaleIcon from '../../assets/mascot.png'
import { useEffect, useState } from 'react';
export default function AIAssistant(){
    
    let chat = document.querySelector('.ai-chat-container');
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);

    function sendMessage(){
        const now = new Date().toLocaleString();
        setMessages(prev =>{
            return [...prev,{
                'message': message,
                date_sent: now
            }]
        })
        const input = document.getElementById('chat-input');
        input.disabled = true;
        
        let stop;

        setTimeout(() => {
            stop = waitLang();
        }, 100);
         
        setTimeout(() => {
            stop();
            const chats = document.querySelector('.chats-container');
            const error = document.createElement('div');
            const erroMess = document.createElement('p');
            erroMess.innerHTML = 'Error timed out.'
            erroMess.className = 'message-error'
            const erroDate = document.createElement('p');;
            erroDate.innerHTML = new Date().toLocaleString();
            erroDate.className = 'message-date'
            error.appendChild(erroMess);
            error.appendChild(erroDate);
            chats.appendChild(error);
            input.disabled = false;
            input.value = "";
        }, 3000);

    }

    function waitLang(){
        const chats = document.querySelector('.chats-container');
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
            chats.removeChild(typingContainer);
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
                            return <div key={currMessage.date_sent} className="user-message-container">
                                        <p className="user-message">{currMessage.message}</p>
                                        <p className='message-date'>{currMessage.date_sent}</p>
                                    </div>
                        })}
                    </div>
                    <div className="chat-input-container">
                        <input type="text" className='chat-input' id='chat-input' placeholder='Ask me anything' onChange={(e) => setMessage(e.target.value)}/>
                        <i className="ti ti-send-2 send-icon" onClick={() => sendMessage()}></i>
                    </div>
            </div>
            <div className="ai-assistant-button" onClick={showChat}>
                <img src={RobabaleIcon} alt=""  className='ai-assistant-icon'/>
            </div>
        </div>
    )
}