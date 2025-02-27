// Chatbox.js
import React, { useState, useRef } from 'react';
import './Chatbot.css';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const textFieldRef = useRef(null);

    const toggleChatbox = () => {
        setIsOpen(!isOpen);
    };

    const onSendMessage = async () => {
        const text = textFieldRef.current.value.trim();
        if (!text) return;

        // Add user message to the chat history
        const userMessage = { name: 'User', message: text };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Clear the input field
        textFieldRef.current.value = '';

        try {
            // Send user message to the Flask backend
            const response = await fetch('http://127.0.0.1:5000/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();
            // Add bot's response to the chat history
            const botMessage = { name: 'Sam', message: data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { name: 'Sam', message: 'Sorry, I am having trouble responding at the moment.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSendMessage();
        }
    };

    return (
        <div className="chatbox">
            <div className="chatbox__button" onClick={toggleChatbox}>
                <button>
                    <img src="/chatbot-icon.svg" alt="Chat icon" />
                </button>
            </div>
            {isOpen && (
                <div className="chatbox__support chatbox--active">
                    <div className="chatbox__header">
                        <div className="chatbox__image--header">
                            <img
                                src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png"
                                alt="Chat Support"
                            />
                        </div>
                        <div className="chatbox__content--header">
                            <h4 className="chatbox__heading--header">Chat Support</h4>
                            <p className="chatbox__description--header">Hi. My name is Sam. How can I help you?</p>
                        </div>
                    </div>
                    <div className="chatbox__messages">
                        {messages.slice().reverse().map((msg, index) => (
                            <div
                                key={index}
                                className={`messages__item ${
                                    msg.name === 'Sam' ? 'messages__item--visitor' : 'messages__item--operator'
                                }`}
                            >
                                {msg.message}
                            </div>
                        ))}
                    </div>
                    <div className="chatbox__footer">
                        <input
                            type="text"
                            placeholder="Write a message..."
                            ref={textFieldRef}
                            onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
                        />
                        <button className="chatbox__send--footer send__button" onClick={onSendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;
