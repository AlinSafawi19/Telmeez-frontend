import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '../../contexts/MessagesContext';
import { FaUser, FaRobot, FaPaperPlane } from 'react-icons/fa';

const ChatTab: React.FC = () => {
    const { messages, addMessage, markAsRead } = useMessages();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            addMessage(newMessage.trim(), 'user');
            setNewMessage('');
            // Simulate admin response after 1 second
            setTimeout(() => {
                addMessage('Thank you for your message. I will get back to you shortly.', 'admin');
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        onClick={() => !message.read && markAsRead(message.id)}
                    >
                        <div
                            className={`flex items-start space-x-2 max-w-[70%] ${
                                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}
                        >
                            <div className={`p-2 rounded-full ${
                                message.sender === 'user' 
                                    ? 'bg-indigo-100 text-indigo-600' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {message.sender === 'user' ? <FaUser className="h-4 w-4" /> : <FaRobot className="h-4 w-4" />}
                            </div>
                            <div className={`rounded-lg p-3 ${
                                message.sender === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                            }`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                                }`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <FaPaperPlane className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatTab; 