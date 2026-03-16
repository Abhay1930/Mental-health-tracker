import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Message = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  max-width: 80%;
  
  ${props => props.isUser ? `
    background-color: var(--primary-color);
    color: white;
    align-self: flex-end;
  ` : `
    background-color: var(--background-color);
    color: var(--text-color);
    align-self: flex-start;
  `}
`;

const ChatInput = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: var(--spacing-sm);
`;

const Input = styled.input`
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: var(--background-color);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const SendButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your mental health assistant. How are you feeling today?",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', { 
        message: userMessage 
      });
      
      setMessages(prev => [...prev, { 
        text: response.data.message, 
        isUser: false 
      }]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        "I'm having trouble processing your message. Please try again.";
      
      setMessages(prev => [...prev, { 
        text: errorMessage,
        isUser: false,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        <i className={`fas fa-${isOpen ? 'times' : 'comment-dots'}`}></i>
      </ChatButton>
      
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <i className="fas fa-robot"></i>
            Mental Health Assistant
          </ChatHeader>
          
          <ChatMessages>
            {messages.map((msg, index) => (
              <Message key={index} isUser={msg.isUser}>
                {msg.text}
              </Message>
            ))}
            {isLoading && (
              <Message isUser={false}>
                <i className="fas fa-spinner fa-spin"></i> Thinking...
              </Message>
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>
          
          <ChatInput>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <SendButton 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </SendButton>
          </ChatInput>
        </ChatWindow>
      )}
    </ChatContainer>
  );
};

export default Chatbot;
