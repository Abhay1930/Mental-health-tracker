import { createContext, useState, useEffect } from 'react';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState(() => {
    const saved = localStorage.getItem('aiEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('aiEnabled', JSON.stringify(isAIEnabled));
  }, [isAIEnabled]);

  const toggleAI = () => {
    setIsAIEnabled(prev => !prev);
  };

  return (
    <AIContext.Provider value={{ isAIEnabled, toggleAI }}>
      {children}
    </AIContext.Provider>
  );
};
