import './ai-assistant.css'
import RobabaleIcon from '../../assets/mascot.png'
import { useEffect, useState } from 'react';
import { sendChatMessage } from '../../scripts/ai';

export default function AIAssistant({ pageContext }){
    let chat = document.querySelector('.ai-chat-container');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [prefetchedGreeting, setPrefetchedGreeting] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    async function sendMessage(overrideMessage){

        if ((!message && !overrideMessage) || isLoading) {
            return;
        }

        const now = new Date().toLocaleString();
        const userMessage = overrideMessage ?? message;
        const input = document.getElementById('chat-input');

        if (input) {
            input.disabled = true;
            setMessage('');
        }

        setMessages(prev =>{
            return [...prev,{
                message: userMessage,
                date_sent: now,
                from: 'user'
            }]
        })

        setIsLoading(true);
        let stop;
        requestAnimationFrame(() => {
            stop = loadingAnimation();
        });

        try {
            const reply = await sendChatMessage(userMessage, pageContext);
            setMessages(prev => {
                return [...prev, {
                    message: reply,
                    date_sent: now,
                    from: 'assistant'
                }]
            })
        } catch (err) {
            const code = err && err.message ? err.message : '';
            if (code === 'RATE_LIMIT') {
                setMessages(prev => {
                    return [...prev, {
                        message: 'Too many requests. Please try again in 20 seconds.',
                        date_sent: now,
                        from: 'assistant'
                    }]
                })
            } else {
                setMessages(prev => {
                    return [...prev, {
                        message: 'Something went wrong.',
                        date_sent: now,
                        from: 'assistant'
                    }]
                })
            }
        } finally {
            if (stop) {
                stop();
            }
            setIsLoading(false);
            setMessage('');
            if (input) input.disabled = false;
        }
    }

    function loadingAnimation(){
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

        const messageNodes = chats.querySelectorAll('.user-message-container, .ai-message-container');
        const lastMessage = messageNodes[messageNodes.length - 1];
        if (lastMessage) {
            lastMessage.insertAdjacentElement('afterend', typingContainer);
        } else {
            chats.appendChild(typingContainer);
        }

        const stop = () => {
            if (typingContainer.parentNode) {
                typingContainer.parentNode.removeChild(typingContainer);
            }
        }
        return stop;
    }

    function messageClick(key) {
        const message = document.querySelector(`#msg-${key}`);
        const date = message.lastElementChild;

        if (date.classList.contains('shown')) {
            date.classList.remove('shown');
            date.style.display = 'none';
        }else{
            date.classList.add('shown');
            date.style.display = 'block';
        }
    }

    useEffect(()=>{
        chat = document.querySelector('.ai-chat-container');

        (async () => {
            try {
                const reply = await sendChatMessage('Greet', pageContext);

                const replyTime = new Date().toLocaleString();

                setPrefetchedGreeting({
                    message: reply,
                    date_sent: replyTime,
                    from: 'assistant'
                });
            } catch (err) {
                err
            }
        })();
    }, [])

    useEffect(() => {
        const chats = document.querySelector('.chats-container');
        if (!chats) return;
        chats.scrollTop = chats.scrollHeight;
    }, [messages]);

    function showChat(){
        if(!chat){
            return
        }
        if(chat.classList.contains('active')){
            chat.style.display = 'none'
            chat.classList.remove('active')
        }else{
            chat.style.display = 'flex'
            chat.classList.add('active')

            if (messages.length === 0 && prefetchedGreeting){
                setMessages(prev => {
                    if (prev.length > 0) return prev;
                    return [...prev, prefetchedGreeting];
                });
            }
        }
    }
    
    return(
        <div className="ai-assistant-container">
            <div className="ai-chat-container">
                <div className="chat-header">
                    <img src={RobabaleIcon} alt="Robable Icon" />

                    <span className='chat-header-content'>
                        <p className='chat-header-title'>Robable</p>
                        <p className='chat-header-desc'>AI Assistant</p>
                    </span>
                    <button className="close-ai-assistant-btn" onClick={showChat}>
                        <i className="ti ti-x close-icon"></i>
                    </button>
                </div>
                <div className="chats-container">
                    {messages && messages.map((currMessage, idx)=>{
                        const isUser = currMessage.from === 'user';
                        const containerClass = isUser ? 'user-message-container' : 'ai-message-container';
                        const messageClass = isUser ? 'user-message' : 'ai-message';
                        return <div id={'msg-' + idx} key={idx} className={containerClass} onClick={()=>messageClick(idx)}>
                                    <p className={messageClass}>{currMessage.message}</p>
                                    <p className='message-date'>{currMessage.date_sent}</p>
                                </div>
                    })}
                </div>

                <div className="chat-input-container">
                    <textarea
                        className='chat-input'
                        id='chat-input'
                        placeholder='Ask me anything'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
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