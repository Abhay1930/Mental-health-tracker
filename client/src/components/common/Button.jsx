import styled, { css } from 'styled-components';

const ButtonVariants = {
  primary: css`
    background: var(--wellness-gradient);
    color: white;
    box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);
    
    &:hover {
      background: var(--wellness-gradient);
      filter: brightness(1.1);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
      transform: translateY(-2px);
    }
  `,
  secondary: css`
    background: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    
    &:hover {
      background: rgba(99, 102, 241, 0.05);
      transform: translateY(-2px);
    }
  `,
  danger: css`
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    color: white;
    
    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }
  `,
  success: css`
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: white;
    
    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }
  `
};

const ButtonSizes = {
  small: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `,
  large: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
  `
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-family: var(--font-main);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  outline: none;
  letter-spacing: -0.01em;
  
  ${props => ButtonVariants[props.$variant || 'primary']}
  ${props => ButtonSizes[props.$size || 'medium']}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  &:active {
    transform: translateY(0) scale(0.98);
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
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
