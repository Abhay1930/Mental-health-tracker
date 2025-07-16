import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import { moodApi, journalApi, goalsApi } from '../../utils/api';

const ScoreContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ScoreCard = styled(Card)`
  padding: var(--spacing-lg);
`;

const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ScoreTitle = styled.h3`
  margin: 0;
`;

const ScoreDate = styled.div`
  color: var(--text-secondary);
  font-size: var(--font-size-small);
`;

const ScoreContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
`;

const ScoreGauge = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
  }
`;

const ScoreCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    var(--primary-color) ${props => props.score}%,
    var(--background-color) 0%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: var(--card-background);
  }
`;

const ScoreValue = styled.div`
  position: relative;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-color);
  z-index: 1;
`;

const ScoreFactors = styled.div`
  flex: 1;
  margin-left: var(--spacing-lg);
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const FactorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FactorItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
`;

const FactorIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
`;

const FactorInfo = styled.div`
  flex: 1;
`;

const FactorName = styled.div`
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const FactorScore = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const FactorBar = styled.div`
  flex: 1;
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
`;

const FactorBarFill = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background-color: ${props => props.color || 'var(--primary-color)'};
`;

const FactorValue = styled.div`
  font-size: var(--font-size-small);
  font-weight: 600;
  color: ${props => props.color || 'var(--primary-color)'};
  width: 30px;
  text-align: right;
`;

const DailyTip = styled.div`
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: rgba(0, 113, 227, 0.1);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--primary-color);
`;

const TipTitle = styled.div`
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  
  i {
    margin-right: var(--spacing-sm);
    color: var(--primary-color);
  }
`;

const TipContent = styled.p`
  margin: 0;
  font-size: var(--font-size-small);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const WellnessScore = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const calculateWellnessScore = async () => {
      try {
        setLoading(true);
        
        // Fetch data from different sources
        const [moodResponse, journalResponse, goalsResponse] = await Promise.all([
          moodApi.getMoods(),
          journalApi.getJournals(),
          goalsApi.getGoals()
        ]);
        
        const moods = moodResponse.data;
        const journals = journalResponse.data;
        const goals = goalsResponse.data;
        
        // Calculate mood score (30% of total)
        let moodScore = 0;
        if (moods.length > 0) {
          // Get average of recent moods (last 7 days)
          const recentMoods = moods.slice(0, 7);
          const avgMood = recentMoods.reduce((sum, mood) => sum + mood.mood, 0) / recentMoods.length;
          moodScore = (avgMood / 10) * 100; // Convert to percentage
        }
        
        // Calculate journal score (20% of total)
        let journalScore = 0;
        if (journals.length > 0) {
          // Check journal frequency (last 7 days)
          const last7Days = new Date();
          last7Days.setDate(last7Days.getDate() - 7);
          
          const recentJournals = journals.filter(journal => 
            new Date(journal.createdAt) >= last7Days
          );
          
          journalScore = (recentJournals.length / 7) * 100; // Percentage of days with entries
          journalScore = Math.min(journalScore, 100); // Cap at 100%
        }
        
        // Calculate goals score (30% of total)
        let goalsScore = 0;
        if (goals.length > 0) {
          // Calculate percentage of completed goals and steps
          const totalGoals = goals.length;
          const completedGoals = goals.filter(goal => goal.isCompleted).length;
          
          // Calculate steps completion for in-progress goals
          let stepsCompletion = 0;
          const inProgressGoals = goals.filter(goal => !goal.isCompleted);
          
          if (inProgressGoals.length > 0) {
            inProgressGoals.forEach(goal => {
              if (goal.steps && goal.steps.length > 0) {
                const totalSteps = goal.steps.length;
                const completedSteps = goal.steps.filter(step => step.isCompleted).length;
                stepsCompletion += completedSteps / totalSteps;
              }
            });
            
            stepsCompletion = stepsCompletion / inProgressGoals.length;
          }
          
          // Combine completed goals and steps progress
          goalsScore = ((completedGoals / totalGoals) * 0.7 + stepsCompletion * 0.3) * 100;
        }
        
        // Calculate sleep score (20% of total)
        let sleepScore = 0;
        if (moods.length > 0) {
          // Get average sleep from mood entries with sleep data
          const entriesWithSleep = moods.filter(mood => mood.sleepHours);
          
          if (entriesWithSleep.length > 0) {
            const avgSleep = entriesWithSleep.reduce((sum, mood) => sum + mood.sleepHours, 0) / entriesWithSleep.length;
            
            // Optimal sleep is 7-9 hours
            if (avgSleep >= 7 && avgSleep <= 9) {
              sleepScore = 100;
            } else if (avgSleep >= 6 && avgSleep < 7) {
              sleepScore = 80;
            } else if (avgSleep > 9 && avgSleep <= 10) {
              sleepScore = 80;
            } else if (avgSleep >= 5 && avgSleep < 6) {
              sleepScore = 60;
            } else if (avgSleep > 10) {
              sleepScore = 60;
            } else {
              sleepScore = 40;
            }
          }
        }
        
        // Calculate overall wellness score
        const overallScore = Math.round(
          (moodScore * 0.3) + (journalScore * 0.2) + (goalsScore * 0.3) + (sleepScore * 0.2)
        );
        
        // Generate daily tip based on scores
        let tip = '';
        let lowestScore = Math.min(moodScore, journalScore, goalsScore, sleepScore);
        
        if (lowestScore === moodScore) {
          tip = 'Try practicing gratitude or mindfulness exercises to improve your mood. Even a few minutes each day can make a difference.';
        } else if (lowestScore === journalScore) {
          tip = 'Regular journaling can help process emotions and track patterns. Try setting aside 5 minutes each day to write.';
        } else if (lowestScore === goalsScore) {
          tip = 'Break down your goals into smaller, manageable steps. Celebrating small wins can boost motivation.';
        } else if (lowestScore === sleepScore) {
          tip = 'Improve sleep quality by maintaining a consistent sleep schedule and creating a relaxing bedtime routine.';
        }
        
        // Set the wellness score
        setScore({
          overall: overallScore,
          factors: [
            { name: 'Mood', value: Math.round(moodScore), color: '#5ac8fa', icon: 'smile' },
            { name: 'Journaling', value: Math.round(journalScore), color: '#ff9500', icon: 'book' },
            { name: 'Goals', value: Math.round(goalsScore), color: '#4cd964', icon: 'bullseye' },
            { name: 'Sleep', value: Math.round(sleepScore), color: '#5856d6', icon: 'moon' }
          ],
          tip
        });
      } catch (err) {
        console.error('Error calculating wellness score:', err);
        setError('Failed to calculate wellness score. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    calculateWellnessScore();
  }, []);
  
  if (loading) {
    return (
      <ScoreContainer>
        <LoadingState>Calculating your wellness score...</LoadingState>
      </ScoreContainer>
    );
  }
  
  if (error) {
    return (
      <ScoreContainer>
        <div style={{ color: 'var(--error-color)' }}>{error}</div>
      </ScoreContainer>
    );
  }
  
  if (!score) {
    return null;
  }
  
  return (
    <ScoreContainer>
      <ScoreCard>
        <ScoreHeader>
          <ScoreTitle>Your Wellness Score</ScoreTitle>
          <ScoreDate>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </ScoreDate>
        </ScoreHeader>
        
        <ScoreContent>
          <ScoreGauge>
            <ScoreCircle score={score.overall}>
              <ScoreValue>{score.overall}</ScoreValue>
            </ScoreCircle>
          </ScoreGauge>
          
          <ScoreFactors>
            <FactorsList>
              {score.factors.map((factor, index) => (
                <FactorItem key={index}>
                  <FactorIcon color={factor.color}>
                    <i className={`fas fa-${factor.icon}`}></i>
                  </FactorIcon>
                  <FactorInfo>
                    <FactorName>{factor.name}</FactorName>
                    <FactorScore>
                      <FactorBar>
                        <FactorBarFill value={factor.value} color={factor.color} />
                      </FactorBar>
                      <FactorValue color={factor.color}>{factor.value}</FactorValue>
                    </FactorScore>
                  </FactorInfo>
                </FactorItem>
              ))}
            </FactorsList>
          </ScoreFactors>
        </ScoreContent>
        
        <DailyTip>
          <TipTitle>
            <i className="fas fa-lightbulb"></i>
            Daily Wellness Tip
          </TipTitle>
          <TipContent>{score.tip}</TipContent>
        </DailyTip>
      </ScoreCard>
    </ScoreContainer>
  );
};

export default WellnessScore;
