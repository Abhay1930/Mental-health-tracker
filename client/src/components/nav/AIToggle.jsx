import { useContext } from 'react';
import styled from 'styled-components';
import { AIContext } from '../../context/AIContext';

const AIButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  padding: var(--spacing-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--primary-color);
  }

  i {
    font-size: 1.2rem;
  }
`;

const AIToggle = () => {
  const { isAIEnabled, toggleAI } = useContext(AIContext);

  return (
    <AIButton onClick={toggleAI} title={isAIEnabled ? 'Disable AI Assistant' : 'Enable AI Assistant'}>
      <i className={`fas fa-${isAIEnabled ? 'robot' : 'robot'}`}></i>
      <span className="sr-only">AI Assistant</span>
    </AIButton>
  );
};

export default AIToggle;
