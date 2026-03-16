import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../common/Container';

const FooterContainer = styled.footer`
  background-color: var(--card-background);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FooterLogo = styled.div`
  font-size: var(--font-size-large);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
`;

const FooterLinks = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const FooterText = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  margin: 0;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <FooterLogo>Mental Health Tracker</FooterLogo>
          
          <FooterLinks>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/resources">Resources</FooterLink>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
          </FooterLinks>
          
          <FooterText>
            &copy; {currentYear} Mental Health Tracker. All rights reserved.
          </FooterText>
          
          <FooterText style={{ marginTop: 'var(--spacing-sm)' }}>
            This application is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </FooterText>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
