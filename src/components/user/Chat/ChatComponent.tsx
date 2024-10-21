import React, { useState, useRef, useEffect } from 'react';

// Basic message type definition
interface Message {
  id: string;
  sender: string; // 'user' or 'bot'
  content: string;
  timestamp: Date;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); // Chat history
  const [input, setInput] = useState(''); // Input field
  const chatEndRef = useRef<HTMLDivElement | null>(null); // For auto-scroll

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message sending
  const sendMessage = () => {
    if (input.trim() === '') return;

    // New message object
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Add the new message to the chat history
    setMessages([...messages, newMessage]);

    // Clear the input field
    setInput('');

    // Simulate bot reply after a short delay
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        content: 'This is an automated reply.',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    }, 1000); // 1-second delay for bot reply
  };

  return (
    <div className="chat-container w-96">
      {/* Chat history display */}
      <div className="chat-window border rounded-lg p-4 bg-gray-50 overflow-y-auto h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'text-right' : 'text-left'} mb-2`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {/* Auto-scroll helper */}
        <div ref={chatEndRef} />
      </div>

      {/* Message input */}
      <div className="input-area mt-4 flex">
        <input
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
