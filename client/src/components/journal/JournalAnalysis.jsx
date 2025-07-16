import { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
import axios from 'axios';

const AnalysisContainer = styled.div`
  margin-top: var(--spacing-lg);
`;

const AnalysisButton = styled(Button)`
  margin-bottom: var(--spacing-md);
`;

const AnalysisCard = styled(Card)`
  margin-bottom: var(--spacing-lg);
`;

const AnalysisSection = styled.div`
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin-bottom: var(--spacing-xs);
  color: var(--primary-color);
`;

const SentimentIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
`;

const SentimentBar = styled.div`
  flex: 1;
  height: 8px;
  background: linear-gradient(to right, #ff6b6b, #ffcc5c, #88d8b0);
  border-radius: 4px;
  position: relative;
  margin: 0 var(--spacing-md);
`;

const SentimentMarker = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--primary-color);
  border-radius: 50%;
  top: 50%;
  left: ${props => props.position}%;
  transform: translate(-50%, -50%);
`;

const SentimentLabel = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  width: 80px;
  text-align: center;
`;

const EmotionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const EmotionTag = styled.div`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => `rgba(${props.color}, 0.1)`};
  color: ${props => `rgb(${props.color})`};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
`;

const ThemesList = styled.ul`
  margin: 0;
  padding-left: var(--spacing-lg);
  
  li {
    margin-bottom: var(--spacing-xs);
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-md);
  color: var(--text-secondary);
`;

const JournalAnalysis = ({ content }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const analyzeJournal = async () => {
    if (!content || content.trim() === '') {
      setError('Journal content is empty. Nothing to analyze.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to a natural language processing service
      // For this demo, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a simulated sentiment score between -1 and 1
      const sentimentScore = Math.random() * 2 - 1;
      
      // Map the sentiment score to a position on the sentiment bar (0-100%)
      const sentimentPosition = ((sentimentScore + 1) / 2) * 100;
      
      // Generate simulated emotions
      const emotions = [];
      const possibleEmotions = [
        { name: 'Joy', color: '76, 217, 100' },
        { name: 'Sadness', color: '90, 200, 250' },
        { name: 'Anger', color: '255, 59, 48' },
        { name: 'Fear', color: '255, 149, 0' },
        { name: 'Surprise', color: '255, 204, 0' },
        { name: 'Disgust', color: '175, 82, 222' },
        { name: 'Trust', color: '0, 122, 255' },
        { name: 'Anticipation', color: '255, 45, 85' }
      ];
      
      // Select 2-4 random emotions
      const numEmotions = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...possibleEmotions].sort(() => 0.5 - Math.random());
      for (let i = 0; i < numEmotions; i++) {
        emotions.push({
          ...shuffled[i],
          intensity: Math.floor(Math.random() * 100)
        });
      }
      
      // Sort emotions by intensity (descending)
      emotions.sort((a, b) => b.intensity - a.intensity);
      
      // Generate simulated themes
      const possibleThemes = [
        'Self-reflection',
        'Personal growth',
        'Relationships',
        'Work-life balance',
        'Health concerns',
        'Future planning',
        'Past experiences',
        'Gratitude',
        'Challenges',
        'Achievements'
      ];
      
      // Select 2-4 random themes
      const numThemes = Math.floor(Math.random() * 3) + 2;
      const themes = [...possibleThemes]
        .sort(() => 0.5 - Math.random())
        .slice(0, numThemes);
      
      // Generate a simulated insight
      const insights = [
        'You seem to be focusing on positive aspects of your life, which is great for mental wellbeing.',
        'Your journal shows signs of stress. Consider practicing mindfulness exercises.',
        'You mention relationships frequently. Social connections are important for mental health.',
        'Your writing indicates you\'re in a reflective mood. This is a good time for goal setting.',
        'There are signs of anxiety in your journal. Deep breathing exercises might help.',
        'You express gratitude in your writing, which is linked to improved mental health.',
        'Your journal shows a focus on the future. Remember to also appreciate the present moment.'
      ];
      
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      
      // Set the analysis state
      setAnalysis({
        sentiment: {
          score: sentimentScore,
          position: sentimentPosition,
          label: getSentimentLabel(sentimentScore)
        },
        emotions,
        themes,
        insight: randomInsight
      });
    } catch (err) {
      console.error('Error analyzing journal:', err);
      setError('Failed to analyze journal. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getSentimentLabel = (score) => {
    if (score >= 0.6) return 'Very Positive';
    if (score >= 0.2) return 'Positive';
    if (score >= -0.2) return 'Neutral';
    if (score >= -0.6) return 'Negative';
    return 'Very Negative';
  };
  
  return (
    <AnalysisContainer>
      {!analysis && !loading && (
        <AnalysisButton onClick={analyzeJournal}>
          <i className="fas fa-brain"></i> Analyze Journal Entry
        </AnalysisButton>
      )}
      
      {loading && (
        <LoadingState>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: 'var(--spacing-sm)' }}></i>
          Analyzing your journal...
        </LoadingState>
      )}
      
      {error && (
        <div style={{ color: 'var(--error-color)', marginBottom: 'var(--spacing-md)' }}>
          {error}
        </div>
      )}
      
      {analysis && (
        <AnalysisCard>
          <AnalysisSection>
            <SectionTitle>Sentiment Analysis</SectionTitle>
            <SentimentIndicator>
              <SentimentLabel>Negative</SentimentLabel>
              <SentimentBar>
                <SentimentMarker position={analysis.sentiment.position} />
              </SentimentBar>
              <SentimentLabel>Positive</SentimentLabel>
            </SentimentIndicator>
            <div style={{ textAlign: 'center', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
              Overall tone: {analysis.sentiment.label}
            </div>
          </AnalysisSection>
          
          <AnalysisSection>
            <SectionTitle>Detected Emotions</SectionTitle>
            <EmotionsList>
              {analysis.emotions.map((emotion, index) => (
                <EmotionTag key={index} color={emotion.color}>
                  {emotion.name}
                </EmotionTag>
              ))}
            </EmotionsList>
          </AnalysisSection>
          
          <AnalysisSection>
            <SectionTitle>Key Themes</SectionTitle>
            <ThemesList>
              {analysis.themes.map((theme, index) => (
                <li key={index}>{theme}</li>
              ))}
            </ThemesList>
          </AnalysisSection>
          
          <AnalysisSection>
            <SectionTitle>Insight</SectionTitle>
            <p>{analysis.insight}</p>
          </AnalysisSection>
          
          <div style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
            Note: This is a simulated analysis for demonstration purposes.
          </div>
          
          <Button 
            variant="secondary" 
            onClick={() => setAnalysis(null)} 
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            Reset Analysis
          </Button>
        </AnalysisCard>
      )}
    </AnalysisContainer>
  );
};

export default JournalAnalysis;
