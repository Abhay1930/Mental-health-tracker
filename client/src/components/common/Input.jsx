import { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
  width: 100%;
`;

const Label = styled.label`
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-xs);
  color: var(--text-color);
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid ${props => props.error ? 'var(--error-color)' : 'var(--border-color)'};
  background-color: var(--card-background);
  font-size: var(--font-size-medium);
  transition: border-color var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? 'var(--error-color)' : 'var(--primary-color)'};
    box-shadow: 0 0 0 1px ${props => props.error ? 'var(--error-color)' : 'var(--primary-color)'};
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
  
  &:disabled {
    background-color: var(--background-color);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: var(--error-color);
  font-size: var(--font-size-small);
  margin-top: var(--spacing-xs);
`;

const HelperText = styled.span`
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  margin-top: var(--spacing-xs);
`;

const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <InputContainer>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span style={{ color: 'var(--error-color)' }}> *</span>}
        </Label>
      )}
      <StyledInput
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={!!error}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
};

export default Input;
