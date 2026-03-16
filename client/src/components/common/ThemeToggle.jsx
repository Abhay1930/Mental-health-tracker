import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const ToggleContainer = styled.button`
  background: none;
  border: none;
  padding: var(--spacing-xs);
  color: var(--text-color);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--background-color);
  }
`;

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <ToggleContainer 
      onClick={toggleTheme}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
    </ToggleContainer>
  );
};

export default ThemeToggle;
