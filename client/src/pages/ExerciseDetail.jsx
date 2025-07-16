import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import ExerciseProgress from '../components/exercises/ExerciseProgress';
import { exercisesApi } from '../utils/api';

const DetailContainer = styled.div`
  padding: var(--spacing-lg) 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ExerciseIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-right: var(--spacing-lg);
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseMeta = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-secondary);

  span {
    display: flex;
    align-items: center;
    margin-right: var(--spacing-lg);

    i {
      margin-right: var(--spacing-xs);
    }
  }
`;

const DetailSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
`;

const Description = styled.div`
  white-space: pre-line;
  margin-bottom: var(--spacing-lg);
`;

const StepsList = styled.ol`
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);

  li {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-xs);
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
`;

const BenefitTag = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;

  i {
    color: var(--primary-color);
    margin-right: var(--spacing-sm);
  }
`;

const StartExerciseButton = styled(Button)`
  margin-top: var(--spacing-md);
`;

const TimerContainer = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  background-color: var(--background-color);
  border-radius: var(--border-radius-lg);
`;

const Timer = styled.div`
  font-size: 3rem;
  font-weight: 600;
  margin: var(--spacing-md) 0;
`;

const TimerControls = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const ErrorState = styled.div`
  padding: var(--spacing-md);
  color: var(--error-color);
  text-align: center;
`;

const ExerciseDetail = () => {
  const { id } = useParams();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await exercisesApi.getExercise(id);
        setExercise(response.data);
        setTime(response.data.duration * 60); // Convert minutes to seconds
        setError(null);
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError('Failed to load exercise. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
    setShowTimer(true);
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(exercise.duration * 60);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Meditation':
        return 'spa';
      case 'Breathing':
        return 'wind';
      case 'Physical':
        return 'dumbbell';
      case 'Cognitive':
        return 'brain';
      case 'Mindfulness':
        return 'leaf';
      default:
        return 'star';
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading exercise...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>{error}</ErrorState>
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container>
        <ErrorState>Exercise not found.</ErrorState>
      </Container>
    );
  }

  return (
    <DetailContainer>
      <Container>
        <PageHeader>
          <PageTitle>{exercise.title}</PageTitle>
        </PageHeader>

        <Card>
          <ExerciseHeader>
            <ExerciseIcon>
              <i className={`fas fa-${getCategoryIcon(exercise.category)}`}></i>
            </ExerciseIcon>
            <ExerciseInfo>
              <ExerciseMeta>
                <span>
                  <i className="far fa-clock"></i>
                  {exercise.duration} minutes
                </span>
                <span>
                  <i className="fas fa-tag"></i>
                  {exercise.category}
                </span>
              </ExerciseMeta>
            </ExerciseInfo>
          </ExerciseHeader>

          <DetailSection>
            <SectionTitle>Description</SectionTitle>
            <Description>{exercise.description}</Description>
          </DetailSection>

          <DetailSection>
            <SectionTitle>Steps</SectionTitle>
            <StepsList>
              {exercise.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </StepsList>
          </DetailSection>

          {exercise.benefits && exercise.benefits.length > 0 && (
            <DetailSection>
              <SectionTitle>Benefits</SectionTitle>
              <BenefitsList>
                {exercise.benefits.map((benefit, index) => (
                  <BenefitTag key={index}>
                    <i className="fas fa-check-circle"></i>
                    {benefit}
                  </BenefitTag>
                ))}
              </BenefitsList>
            </DetailSection>
          )}

          {!showTimer && (
            <StartExerciseButton onClick={startTimer}>
              Start Exercise
            </StartExerciseButton>
          )}

          {showTimer && (
            <TimerContainer>
              <h3>Exercise Timer</h3>
              <Timer>{formatTime(time)}</Timer>
              <TimerControls>
                <Button onClick={pauseTimer}>
                  {isActive ? 'Pause' : 'Resume'}
                </Button>
                <Button variant="secondary" onClick={resetTimer}>
                  Reset
                </Button>
              </TimerControls>
            </TimerContainer>
          )}
        </Card>

        {showTimer && time === 0 && (
          <ExerciseProgress exerciseId={id} />
        )}

        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
          <Button
            as={Link}
            to="/exercises"
            variant="secondary"
          >
            Back to Exercises
          </Button>
        </div>
      </Container>
    </DetailContainer>
  );
};

export default ExerciseDetail;
