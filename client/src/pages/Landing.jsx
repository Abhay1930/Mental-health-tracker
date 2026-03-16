import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { useAuth } from '../context/AuthContext';

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-color) 0%, #e8f0fe 100%);
  padding: var(--spacing-xxl) 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  
  span {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: var(--font-size-large);
  max-width: 600px;
  margin-bottom: var(--spacing-xl);
  color: var(--text-secondary);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-medium);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeaturesSection = styled.section`
  padding: var(--spacing-xxl) 0;
  background-color: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--text-color);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-lg);
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
`;

const FeatureTitle = styled.h3`
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
`;

const CTASection = styled.section`
  padding: var(--spacing-xxl) 0;
  background-color: var(--primary-color);
  color: white;
  text-align: center;
`;

const CTATitle = styled.h2`
  margin-bottom: var(--spacing-md);
`;

const CTADescription = styled.p`
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
  opacity: 0.9;
`;

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  return (
    <>
      <HeroSection>
        <Container>
          <HeroTitle>
            Track Your Mental Health with <span>MindTrack</span>
          </HeroTitle>
          <HeroSubtitle>
            A comprehensive tool to monitor your mood, practice mindfulness, and connect with professional resources.
          </HeroSubtitle>
          <ButtonGroup>
            {currentUser ? (
              <Button size="large" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button size="large" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
                <Button size="large" variant="secondary" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </>
            )}
          </ButtonGroup>
        </Container>
      </HeroSection>
      
      <FeaturesSection>
        <Container>
          <SectionTitle>Key Features</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-chart-line"></i>
              </FeatureIcon>
              <FeatureTitle>Mood Tracking</FeatureTitle>
              <FeatureDescription>
                Track your daily mood and emotions to identify patterns and triggers over time.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-spa"></i>
              </FeatureIcon>
              <FeatureTitle>Mindfulness Exercises</FeatureTitle>
              <FeatureDescription>
                Access guided meditation and breathing exercises to help manage stress and anxiety.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-hands-helping"></i>
              </FeatureIcon>
              <FeatureTitle>Professional Resources</FeatureTitle>
              <FeatureDescription>
                Connect with therapists, counselors, and support groups in your area.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-book"></i>
              </FeatureIcon>
              <FeatureTitle>Mood Journal</FeatureTitle>
              <FeatureDescription>
                Record your thoughts and feelings in a private, secure digital journal.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-users"></i>
              </FeatureIcon>
              <FeatureTitle>Community Support</FeatureTitle>
              <FeatureDescription>
                Connect with others on similar mental health journeys in a safe, moderated environment.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-lock"></i>
              </FeatureIcon>
              <FeatureTitle>Privacy & Security</FeatureTitle>
              <FeatureDescription>
                Your data is encrypted and secure. We prioritize your privacy and confidentiality.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>
      
      <CTASection>
        <Container>
          <CTATitle>Start Your Mental Health Journey Today</CTATitle>
          <CTADescription>
            Join thousands of users who are taking control of their mental wellbeing with MindTrack.
          </CTADescription>
          {currentUser ? (
            <Button size="large" variant="secondary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <Button size="large" variant="secondary" onClick={() => navigate('/register')}>
              Create Free Account
            </Button>
          )}
        </Container>
      </CTASection>
    </>
  );
};

export default Landing;
