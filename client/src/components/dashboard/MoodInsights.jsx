import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import { moodApi } from '../../utils/api';

const InsightsContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const InsightTitle = styled.h3`
  margin-bottom: var(--spacing-md);
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

const InsightCard = styled(Card)`
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const InsightValue = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${props => props.color || 'var(--primary-color)'};
  margin-bottom: var(--spacing-xs);
`;

const InsightLabel = styled.div`
  color: var(--text-secondary);
  font-size: var(--font-size-small);
`;

const InsightDescription = styled.p`
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-small);
  color: var(--text-color);
`;

const CorrelationContainer = styled.div`
  margin-top: var(--spacing-lg);
`;

const CorrelationTitle = styled.h3`
  margin-bottom: var(--spacing-md);
`;

const CorrelationItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
`;

const CorrelationStrength = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  margin-right: var(--spacing-md);
  background-color: ${props => {
    const value = Math.abs(props.value);
    if (value >= 0.7) return 'rgba(76, 217, 100, 0.2)';
    if (value >= 0.4) return 'rgba(255, 204, 0, 0.2)';
    return 'rgba(255, 59, 48, 0.2)';
  }};
  color: ${props => {
    const value = Math.abs(props.value);
    if (value >= 0.7) return 'var(--success-color)';
    if (value >= 0.4) return 'var(--warning-color)';
    return 'var(--error-color)';
  }};
`;

const CorrelationInfo = styled.div`
  flex: 1;
`;

const CorrelationFactor = styled.div`
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const CorrelationDescription = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const MoodInsights = () => {
  const [insights, setInsights] = useState(null);
  const [correlations, setCorrelations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to get insights
        // For now, we'll simulate with mock data
        const moodEntries = await moodApi.getMoods();
        
        if (moodEntries.data.length === 0) {
          setInsights(null);
          setCorrelations([]);
          return;
        }
        
        // Calculate insights
        const moods = moodEntries.data.map(entry => entry.mood);
        const avgMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        
        // Get entries with sleep data
        const entriesWithSleep = moodEntries.data.filter(entry => entry.sleepHours);
        const avgSleep = entriesWithSleep.length > 0 
          ? entriesWithSleep.reduce((sum, entry) => sum + entry.sleepHours, 0) / entriesWithSleep.length 
          : null;
        
        // Get entries with physical activity data
        const entriesWithActivity = moodEntries.data.filter(entry => entry.physicalActivity);
        const avgActivity = entriesWithActivity.length > 0
          ? entriesWithActivity.reduce((sum, entry) => sum + entry.physicalActivity, 0) / entriesWithActivity.length
          : null;
        
        // Calculate mood trend (positive or negative)
        const recentMoods = moods.slice(-7);
        const oldMoods = moods.slice(-14, -7);
        const recentAvg = recentMoods.length > 0 
          ? recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length 
          : null;
        const oldAvg = oldMoods.length > 0
          ? oldMoods.reduce((sum, mood) => sum + mood, 0) / oldMoods.length
          : null;
        const moodTrend = recentAvg !== null && oldAvg !== null
          ? ((recentAvg - oldAvg) / oldAvg) * 100
          : null;
        
        // Calculate correlations
        const sleepCorrelation = calculateCorrelation(
          entriesWithSleep.map(entry => entry.sleepHours),
          entriesWithSleep.map(entry => entry.mood)
        );
        
        const activityCorrelation = calculateCorrelation(
          entriesWithActivity.map(entry => entry.physicalActivity),
          entriesWithActivity.map(entry => entry.mood)
        );
        
        // Set insights
        setInsights({
          avgMood: avgMood.toFixed(1),
          avgSleep: avgSleep !== null ? avgSleep.toFixed(1) : null,
          avgActivity: avgActivity !== null ? Math.round(avgActivity) : null,
          moodTrend: moodTrend !== null ? moodTrend.toFixed(1) : null
        });
        
        // Set correlations
        const correlationsArray = [];
        
        if (sleepCorrelation !== null) {
          correlationsArray.push({
            factor: 'Sleep',
            value: sleepCorrelation,
            description: sleepCorrelation > 0 
              ? 'More sleep appears to be associated with better mood'
              : 'Sleep duration doesn\'t seem to positively affect your mood'
          });
        }
        
        if (activityCorrelation !== null) {
          correlationsArray.push({
            factor: 'Physical Activity',
            value: activityCorrelation,
            description: activityCorrelation > 0
              ? 'Physical activity appears to be associated with better mood'
              : 'Physical activity doesn\'t seem to positively affect your mood'
          });
        }
        
        setCorrelations(correlationsArray);
      } catch (err) {
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, []);
  
  // Function to calculate Pearson correlation coefficient
  const calculateCorrelation = (x, y) => {
    if (x.length !== y.length || x.length < 3) return null;
    
    const n = x.length;
    
    // Calculate means
    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate covariance and standard deviations
    let covariance = 0;
    let xVariance = 0;
    let yVariance = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      
      covariance += xDiff * yDiff;
      xVariance += xDiff * xDiff;
      yVariance += yDiff * yDiff;
    }
    
    // Calculate correlation coefficient
    const correlation = covariance / (Math.sqrt(xVariance) * Math.sqrt(yVariance));
    
    return isNaN(correlation) ? null : correlation;
  };
  
  if (loading) {
    return <LoadingState>Analyzing your mood data...</LoadingState>;
  }
  
  if (!insights) {
    return null;
  }
  
  return (
    <InsightsContainer>
      <InsightTitle>Your Mood Insights</InsightTitle>
      
      <InsightGrid>
        <InsightCard>
          <InsightValue>{insights.avgMood}</InsightValue>
          <InsightLabel>Average Mood</InsightLabel>
          <InsightDescription>
            Your average mood rating out of 10
          </InsightDescription>
        </InsightCard>
        
        {insights.moodTrend !== null && (
          <InsightCard>
            <InsightValue color={parseFloat(insights.moodTrend) >= 0 ? 'var(--success-color)' : 'var(--error-color)'}>
              {parseFloat(insights.moodTrend) >= 0 ? '+' : ''}{insights.moodTrend}%
            </InsightValue>
            <InsightLabel>Mood Trend</InsightLabel>
            <InsightDescription>
              {parseFloat(insights.moodTrend) >= 0 
                ? 'Your mood is improving compared to last week'
                : 'Your mood has decreased compared to last week'}
            </InsightDescription>
          </InsightCard>
        )}
        
        {insights.avgSleep !== null && (
          <InsightCard>
            <InsightValue>{insights.avgSleep}</InsightValue>
            <InsightLabel>Average Sleep (hours)</InsightLabel>
            <InsightDescription>
              {parseFloat(insights.avgSleep) >= 7 
                ? 'You\'re getting a healthy amount of sleep'
                : 'You might benefit from more sleep'}
            </InsightDescription>
          </InsightCard>
        )}
        
        {insights.avgActivity !== null && (
          <InsightCard>
            <InsightValue>{insights.avgActivity}</InsightValue>
            <InsightLabel>Avg. Physical Activity (min)</InsightLabel>
            <InsightDescription>
              {parseFloat(insights.avgActivity) >= 30 
                ? 'You\'re maintaining good activity levels'
                : 'Consider increasing your physical activity'}
            </InsightDescription>
          </InsightCard>
        )}
      </InsightGrid>
      
      {correlations.length > 0 && (
        <CorrelationContainer>
          <CorrelationTitle>Factors Affecting Your Mood</CorrelationTitle>
          
          {correlations.map((correlation, index) => (
            <CorrelationItem key={index}>
              <CorrelationStrength value={correlation.value}>
                {Math.abs(correlation.value).toFixed(2)}
              </CorrelationStrength>
              <CorrelationInfo>
                <CorrelationFactor>{correlation.factor}</CorrelationFactor>
                <CorrelationDescription>{correlation.description}</CorrelationDescription>
              </CorrelationInfo>
            </CorrelationItem>
          ))}
        </CorrelationContainer>
      )}
    </InsightsContainer>
  );
};

export default MoodInsights;
