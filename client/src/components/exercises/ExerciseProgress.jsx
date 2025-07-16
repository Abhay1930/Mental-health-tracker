import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
import { exercisesApi } from '../../utils/api';

const ProgressContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

const ProgressTitle = styled.h3`
  margin-bottom: var(--spacing-md);
`;

const ProgressCard = styled(Card)`
  margin-bottom: var(--spacing-lg);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const StatCard = styled.div`
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const ProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--border-color);
  }
`;

const ExerciseIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.category) {
      case 'Meditation': return '#5ac8fa';
      case 'Breathing': return '#4cd964';
      case 'Physical': return '#ffcc00';
      case 'Cognitive': return '#ff9500';
      case 'Mindfulness': return '#ff3b30';
      default: return 'var(--primary-color)';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseTitle = styled.div`
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const ExerciseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const CompletionBadge = styled.div`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(76, 217, 100, 0.1);
  color: var(--success-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  display: flex;
  align-items: center;
  
  i {
    margin-right: var(--spacing-xs);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  
  p {
    margin-bottom: var(--spacing-md);
    color: var(--text-secondary);
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg);
  color: var(--text-secondary);
`;

const ExerciseProgress = ({ exerciseId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to get user's exercise progress
        // For now, we'll simulate with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate simulated progress data
        const completedCount = Math.floor(Math.random() * 10) + 1;
        const totalDuration = completedCount * (Math.floor(Math.random() * 15) + 5);
        const lastCompletedDate = new Date();
        lastCompletedDate.setDate(lastCompletedDate.getDate() - Math.floor(Math.random() * 7));
        
        // Generate simulated history
        const history = [];
        const categories = ['Meditation', 'Breathing', 'Physical', 'Cognitive', 'Mindfulness'];
        
        for (let i = 0; i < 5; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          const randomDuration = Math.floor(Math.random() * 15) + 5;
          
          history.push({
            id: `exercise-${i}`,
            title: `${randomCategory} Exercise ${i + 1}`,
            category: randomCategory,
            duration: randomDuration,
            completedAt: date,
            isCurrentExercise: i === 0 && exerciseId ? true : false
          });
        }
        
        // If we have an exerciseId, mark it as completed in the history
        if (exerciseId) {
          const currentExercise = {
            id: exerciseId,
            title: 'Current Exercise',
            category: 'Meditation', // This would come from the actual exercise data
            duration: 10, // This would come from the actual exercise data
            completedAt: new Date(),
            isCurrentExercise: true
          };
          
          history.unshift(currentExercise);
        }
        
        setProgress({
          stats: {
            completedCount,
            totalDuration,
            lastCompletedDate,
            streak: Math.floor(Math.random() * 5) + 1
          },
          history
        });
      } catch (err) {
        console.error('Error fetching exercise progress:', err);
        setError('Failed to load exercise progress. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [exerciseId]);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Meditation': return 'spa';
      case 'Breathing': return 'wind';
      case 'Physical': return 'dumbbell';
      case 'Cognitive': return 'brain';
      case 'Mindfulness': return 'leaf';
      default: return 'star';
    }
  };
  
  if (loading) {
    return (
      <ProgressContainer>
        <ProgressTitle>Your Progress</ProgressTitle>
        <LoadingState>Loading your progress...</LoadingState>
      </ProgressContainer>
    );
  }
  
  if (error) {
    return (
      <ProgressContainer>
        <ProgressTitle>Your Progress</ProgressTitle>
        <div style={{ color: 'var(--error-color)' }}>{error}</div>
      </ProgressContainer>
    );
  }
  
  if (!progress) {
    return null;
  }
  
  return (
    <ProgressContainer>
      <ProgressTitle>Your Progress</ProgressTitle>
      
      <ProgressCard>
        <ProgressHeader>
          <h3>Exercise Stats</h3>
        </ProgressHeader>
        
        <ProgressStats>
          <StatCard>
            <StatValue>{progress.stats.completedCount}</StatValue>
            <StatLabel>Exercises Completed</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{progress.stats.totalDuration}</StatValue>
            <StatLabel>Total Minutes</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{progress.stats.streak}</StatValue>
            <StatLabel>Current Streak</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatDate(progress.stats.lastCompletedDate)}</StatValue>
            <StatLabel>Last Exercise</StatLabel>
          </StatCard>
        </ProgressStats>
        
        <h3>Recent Activity</h3>
        
        {progress.history.length === 0 ? (
          <EmptyState>
            <p>You haven't completed any exercises yet.</p>
            <Button as="a" href="/exercises">Browse Exercises</Button>
          </EmptyState>
        ) : (
          <ProgressList>
            {progress.history.map((item, index) => (
              <ProgressItem key={index}>
                <ExerciseIcon category={item.category}>
                  <i className={`fas fa-${getCategoryIcon(item.category)}`}></i>
                </ExerciseIcon>
                <ExerciseInfo>
                  <ExerciseTitle>{item.title}</ExerciseTitle>
                  <ExerciseMeta>
                    <span>{item.category}</span>
                    <span>{item.duration} minutes</span>
                    <span>Completed: {formatDate(item.completedAt)}</span>
                  </ExerciseMeta>
                </ExerciseInfo>
                {item.isCurrentExercise && (
                  <CompletionBadge>
                    <i className="fas fa-check-circle"></i>
                    Just Completed
                  </CompletionBadge>
                )}
              </ProgressItem>
            ))}
          </ProgressList>
        )}
      </ProgressCard>
    </ProgressContainer>
  );
};

export default ExerciseProgress;
