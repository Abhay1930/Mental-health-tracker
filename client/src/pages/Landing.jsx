import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { useAuth } from '../context/AuthContext';

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.05); }
`;

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.35), transparent 70%);
    border-radius: 50%;
    animation: ${pulse} 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.25), transparent 70%);
    border-radius: 50%;
    animation: ${pulse} 8s ease-in-out infinite reverse;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 120px 0 80px;
  animation: ${fadeUp} 0.8s ease-out both;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  color: white;
  margin-bottom: 24px;

  span {
    background: linear-gradient(135deg, #6366f1, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.75);
  max-width: 560px;
  margin: 0 auto 40px;
  line-height: 1.7;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const SecondaryBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 64px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;

  .number {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    display: block;
  }

  .label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;

// ─── Features Section ─────────────────────────────────────────────────────────

const FeaturesSection = styled.section`
  padding: 100px 0;
  background: var(--background-color);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const SectionLabel = styled.p`
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--wellness-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 16px;
`;

const SectionSubtitle = styled.p`
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-xl);
  padding: 32px 28px;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-8px);
    border-color: var(--primary-light);
    box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.15);
  }
`;

const FeatureIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${props => props.$gradient || 'var(--wellness-gradient)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-color);
`;

const FeatureDesc = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
`;

// ─── How It Works Section ─────────────────────────────────────────────────────

const HowSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(180deg, var(--background-color), #f0f0ff 100%);
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 36px;
    left: 20%;
    right: 20%;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #10b981);
    z-index: 0;

    @media (max-width: 768px) { display: none; }
  }

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StepCard = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const StepNumber = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--wellness-gradient);
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
  animation: ${float} ${props => props.$delay || '3s'} ease-in-out infinite;
`;

const StepTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 10px;
`;

const StepDesc = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
`;

// ─── CTA Section ─────────────────────────────────────────────────────────────

const CTASection = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  position: relative;
  overflow: hidden;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%);
    border-radius: 50%;
  }
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 900;
  color: white;
  margin-bottom: 16px;
`;

const CTASubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  max-width: 500px;
  margin: 0 auto 40px;
  line-height: 1.7;
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

const FooterSection = styled.footer`
  background: #0a0a0a;
  padding: 32px 0;
  text-align: center;
  color: rgba(255,255,255,0.45);
  font-size: 0.9rem;

  a {
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    margin: 0 12px;
    transition: color 0.2s;
    &:hover { color: white; }
  }

  .footer-links { margin-bottom: 12px; }
`;

// ─── Features Data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: 'fa-chart-line',
    title: 'Mood Tracking',
    desc: 'Log your daily mood and emotions to uncover patterns and triggers over time.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    icon: 'fa-brain',
    title: 'AI Predictions',
    desc: 'Our LSTM model forecasts your mood for the next 1, 3, and 7 days based on your history.',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: 'fa-spa',
    title: 'Mindfulness Exercises',
    desc: 'Access guided meditation and breathing exercises to manage stress and anxiety.',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    icon: 'fa-book',
    title: 'Mood Journal',
    desc: 'Record your thoughts and feelings in a private, encrypted digital journal.',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
  {
    icon: 'fa-hands-helping',
    title: 'Professional Resources',
    desc: 'Connect with therapists, counselors, and support groups in your area.',
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  },
  {
    icon: 'fa-lock',
    title: 'Privacy & Security',
    desc: 'Your data is encrypted end-to-end. We prioritize your privacy above all.',
    gradient: 'linear-gradient(135deg, #6366f1, #10b981)',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <>
      {/* ── HERO ── */}
      <HeroSection>
        <HeroBg />
        <Container>
          <HeroContent>
            <HeroBadge>
              <i className="fas fa-heart-pulse" /> Mental Wellness Platform
            </HeroBadge>
            <HeroTitle>
              Take Control of Your <span>Mental Wellbeing</span>
            </HeroTitle>
            <HeroSubtitle>
              Track your mood, get AI-powered insights, practice mindfulness, and connect with professional support — all in one beautiful place.
            </HeroSubtitle>
            <HeroButtons>
              {currentUser ? (
                <Button size="large" onClick={() => navigate('/dashboard')}>
                  <i className="fas fa-tachometer-alt" style={{ marginRight: 8 }} />
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button size="large" onClick={() => navigate('/register')}>
                    <i className="fas fa-rocket" style={{ marginRight: 8 }} />
                    Get Started — Free
                  </Button>
                  <SecondaryBtn onClick={() => navigate('/login')}>
                    Sign In
                  </SecondaryBtn>
                </>
              )}
            </HeroButtons>
            <HeroStats>
              <StatItem>
                <span className="number">10K+</span>
                <span className="label">Active Users</span>
              </StatItem>
              <StatItem>
                <span className="number">50K+</span>
                <span className="label">Mood Entries</span>
              </StatItem>
              <StatItem>
                <span className="number">94%</span>
                <span className="label">Feel Better</span>
              </StatItem>
            </HeroStats>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* ── FEATURES ── */}
      <FeaturesSection>
        <Container>
          <SectionHeader>
            <SectionLabel>Everything You Need</SectionLabel>
            <SectionTitle>Your Complete Wellness Toolkit</SectionTitle>
            <SectionSubtitle>
              Powerful features designed by mental health experts to help you build lasting emotional resilience.
            </SectionSubtitle>
          </SectionHeader>
          <FeaturesGrid>
            {features.map((f, i) => (
              <FeatureCard key={i}>
                <FeatureIconWrap $gradient={f.gradient}>
                  <i className={`fas ${f.icon}`} />
                </FeatureIconWrap>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      {/* ── HOW IT WORKS ── */}
      <HowSection>
        <Container>
          <SectionHeader>
            <SectionLabel>Simple & Effective</SectionLabel>
            <SectionTitle>How MindTrack Works</SectionTitle>
            <SectionSubtitle>
              Start your journey in three easy steps and begin seeing meaningful progress within days.
            </SectionSubtitle>
          </SectionHeader>
          <StepsGrid>
            <StepCard>
              <StepNumber $delay="3s">1</StepNumber>
              <StepTitle>Create Your Account</StepTitle>
              <StepDesc>Sign up in under a minute. No credit card required — completely free to start.</StepDesc>
            </StepCard>
            <StepCard>
              <StepNumber $delay="3.5s">2</StepNumber>
              <StepTitle>Log Your Daily Mood</StepTitle>
              <StepDesc>Record how you feel each day along with activities, sleep, and notes.</StepDesc>
            </StepCard>
            <StepCard>
              <StepNumber $delay="4s">3</StepNumber>
              <StepTitle>Get AI Insights</StepTitle>
              <StepDesc>Our LSTM model learns your patterns and predicts your mood up to 7 days ahead.</StepDesc>
            </StepCard>
          </StepsGrid>
        </Container>
      </HowSection>

      {/* ── CTA ── */}
      <CTASection>
        <Container>
          <CTAContent>
            <CTATitle>Begin Your Journey Today</CTATitle>
            <CTASubtitle>
              Join thousands who are already taking meaningful steps towards better mental health.
            </CTASubtitle>
            {currentUser ? (
              <Button size="large" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-tachometer-alt" style={{ marginRight: 8 }} />
                Open Dashboard
              </Button>
            ) : (
              <Button size="large" onClick={() => navigate('/register')}>
                <i className="fas fa-user-plus" style={{ marginRight: 8 }} />
                Create Free Account
              </Button>
            )}
          </CTAContent>
        </Container>
      </CTASection>

      {/* ── FOOTER ── */}
      <FooterSection>
        <Container>
          <div className="footer-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/login">Sign In</a>
            <a href="/register">Register</a>
          </div>
          <p>© 2026 MindTrack. All rights reserved.</p>
          <p style={{ marginTop: 6, fontSize: '0.8rem', opacity: 0.6 }}>
            Not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </Container>
      </FooterSection>
    </>
  );
};

export default Landing;
