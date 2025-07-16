import styled, { css } from 'styled-components';

const ButtonVariants = {
  primary: css`
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: var(--secondary-color);
    }
  `,
  secondary: css`
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    
    &:hover {
      background-color: var(--background-color);
    }
  `,
  danger: css`
    background-color: var(--error-color);
    color: white;
    
    &:hover {
      background-color: #ff6961;
    }
  `,
  success: css`
    background-color: var(--success-color);
    color: white;
    
    &:hover {
      background-color: #5ddc7a;
    }
  `
};

const ButtonSizes = {
  small: css`
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-small);
  `,
  medium: css`
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-medium);
  `,
  large: css`
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-large);
  `
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  outline: none;
  
  ${props => ButtonVariants[props.variant || 'primary']}
  ${props => ButtonSizes[props.size || 'medium']}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  &:focus {
    box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--primary-color);
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
