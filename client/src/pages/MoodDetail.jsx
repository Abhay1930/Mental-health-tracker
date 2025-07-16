import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { moodApi } from '../utils/api';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const DetailSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
`;

const MoodLevel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  
  span {
    font-size: 3rem;
    font-weight: 600;
    color: ${props => {
      if (props.value >= 9) return '#4cd964'; // Excellent
      if (props.value >= 7) return '#5ac8fa'; // Good
      if (props.value >= 5) return '#ffcc00'; // Neutral
      if (props.value >= 3) return '#ff9500'; // Poor
      return '#ff3b30'; // Very Poor
    }};
    margin-right: var(--spacing-md);
  }
  
  p {
    font-size: var(--font-size-large);
    margin: 0;
    color: var(--text-secondary);
  }
`;

const DateInfo = styled.div`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
`;

const ActivitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const ActivityTag = styled.div`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 113, 227, 0.1);
  color: var(--primary-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
`;

const FactorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FactorItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
`;

const FactorName = styled.span`
  font-weight: 500;
`;

const FactorImpact = styled.div`
  display: flex;
  align-items: center;
  
  span {
    margin-right: var(--spacing-xs);
    color: var(--text-secondary);
  }
  
  div {
    display: flex;
  }
`;

const ImpactDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  margin-right: 3px;
`;

const NotesContainer = styled.div`
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  white-space: pre-line;
`;

const DeleteConfirmation = styled.div`
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  border: 1px solid var(--error-color);
  border-radius: var(--border-radius-md);
  background-color: rgba(255, 59, 48, 0.05);
`;

const ConfirmationTitle = styled.h4`
  color: var(--error-color);
  margin-bottom: var(--spacing-sm);
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
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

const MoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [moodEntry, setMoodEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    const fetchMoodEntry = async () => {
      try {
        setLoading(true);
        const response = await moodApi.getMood(id);
        setMoodEntry(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching mood entry:', err);
        setError('Failed to load mood entry. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMoodEntry();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await moodApi.deleteMood(id);
      navigate('/mood-tracker');
    } catch (err) {
      console.error('Error deleting mood entry:', err);
      setError('Failed to delete mood entry. Please try again.');
      setDeleting(false);
    }
  };
  
  const getMoodDescription = (level) => {
    if (level >= 9) return 'Excellent';
    if (level >= 7) return 'Good';
    if (level >= 5) return 'Neutral';
    if (level >= 3) return 'Poor';
    return 'Very Poor';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingState>Loading mood entry...</LoadingState>
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
  
  if (!moodEntry) {
    return (
      <Container>
        <ErrorState>Mood entry not found.</ErrorState>
      </Container>
    );
  }
  
  return (
    <DetailContainer>
      <Container>
        <PageHeader>
          <PageTitle>Mood Entry</PageTitle>
          <ButtonGroup>
            <Button 
              as={Link} 
              to={`/mood-tracker/${id}/edit`}
              variant="secondary"
            >
              <i className="fas fa-edit"></i> Edit
            </Button>
            <Button 
              variant="danger"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <i className="fas fa-trash"></i> Delete
            </Button>
          </ButtonGroup>
        </PageHeader>
        
        <Card>
          <DateInfo>
            <i className="far fa-calendar"></i> {formatDate(moodEntry.date)}
          </DateInfo>
          
          <DetailSection>
            <SectionTitle>Mood Level</SectionTitle>
            <MoodLevel value={moodEntry.mood}>
              <span>{moodEntry.mood}/10</span>
              <p>{getMoodDescription(moodEntry.mood)}</p>
            </MoodLevel>
          </DetailSection>
          
          {moodEntry.activities && moodEntry.activities.length > 0 && (
            <DetailSection>
              <SectionTitle>Activities</SectionTitle>
              <ActivitiesContainer>
                {moodEntry.activities.map((activity, index) => (
                  <ActivityTag key={index}>{activity}</ActivityTag>
                ))}
              </ActivitiesContainer>
            </DetailSection>
          )}
          
          {moodEntry.factors && moodEntry.factors.length > 0 && (
            <DetailSection>
              <SectionTitle>Factors Affecting Mood</SectionTitle>
              <FactorsContainer>
                {moodEntry.factors.map((factor, index) => (
                  <FactorItem key={index}>
                    <FactorName>{factor.factor}</FactorName>
                    <FactorImpact>
                      <span>Impact:</span>
                      <div>
                        {[1, 2, 3, 4, 5].map(dot => (
                          <ImpactDot key={dot} active={dot <= factor.impact} />
                        ))}
                      </div>
                    </FactorImpact>
                  </FactorItem>
                ))}
              </FactorsContainer>
            </DetailSection>
          )}
          
          {moodEntry.notes && (
            <DetailSection>
              <SectionTitle>Notes</SectionTitle>
              <NotesContainer>
                {moodEntry.notes}
              </NotesContainer>
            </DetailSection>
          )}
          
          {showDeleteConfirmation && (
            <DeleteConfirmation>
              <ConfirmationTitle>Are you sure you want to delete this mood entry?</ConfirmationTitle>
              <p>This action cannot be undone.</p>
              <ConfirmationButtons>
                <Button 
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
              </ConfirmationButtons>
            </DeleteConfirmation>
          )}
        </Card>
        
        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
          <Button 
            as={Link} 
            to="/mood-tracker"
            variant="secondary"
          >
            Back to Mood Tracker
          </Button>
        </div>
      </Container>
    </DetailContainer>
  );
};

export default MoodDetail;
