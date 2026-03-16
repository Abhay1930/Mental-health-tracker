import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import { moodApi } from '../../utils/api';

const PredictionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md) 0;
`;

const ScoreCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-md);

  span.score {
    font-size: 2.5rem;
    font-weight: 700;
  }

  span.label {
    font-size: 0.8rem;
    opacity: 0.9;
  }
`;

const InsightBox = styled.div`
  background: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--primary-color);
  width: 100%;

  h4 {
    margin-bottom: var(--spacing-xs);
    color: var(--text-color);
  }

  p {
    color: var(--text-secondary);
    font-size: var(--font-size-small);
    line-height: 1.4;
  }
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-style: italic;
`;

const MoodPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await moodApi.getPrediction();
        setPrediction(response.data);
      } catch (err) {
        console.error('Failed to fetch prediction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  const getInsight = (score) => {
    if (score >= 8) return "Looking great! Your current habits are supporting a very positive mood. Keep up the social interactions.";
    if (score >= 6) return "A steady day ahead. Your sleep and exercise levels are keeping things balanced.";
    if (score >= 4) return "You might feel a bit drained tomorrow. Try to squeeze in a 10-minute meditation or a short walk.";
    return "Low mood predicted. We recommend prioritizing sleep tonight and reaching out to a friend or professional resource.";
  };

  if (loading) return <Card title="Tomorrow's Prediction"><LoadingText>Analyzing your patterns...</LoadingText></Card>;
  if (!prediction) return null;

  return (
    <Card title="Tomorrow's Prediction">
      <PredictionContainer>
        <ScoreCircle>
          <span className="score">{prediction.predicted_mood}</span>
          <span className="label">Predicted</span>
        </ScoreCircle>
        
        <InsightBox>
          <h4>AI Insight</h4>
          <p>{getInsight(prediction.predicted_mood)}</p>
        </InsightBox>
      </PredictionContainer>
    </Card>
  );
};

export default MoodPrediction;
