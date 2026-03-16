import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h2`
  color: var(--danger-color, #dc3545);
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: var(--text-color, #333);
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color, #4361ee);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark-color, #3a56d4);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {

    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {

      return (
        <ErrorContainer>
          <Title>Oops! Something went wrong.</Title>
          <Message>
            We're sorry, but an unexpected error occurred. This has been logged and we're looking into it.
            Please try reloading the page.
          </Message>
          <Button onClick={this.handleReload}>
            Reload Page
          </Button>
        </ErrorContainer>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
