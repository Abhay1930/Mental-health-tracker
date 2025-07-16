import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { goalsApi } from '../utils/api';

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

const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const GoalIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.category) {
      case 'Mental': return '#5ac8fa';
      case 'Physical': return '#4cd964';
      case 'Social': return '#ffcc00';
      case 'Career': return '#ff9500';
      case 'Personal': return '#ff3b30';
      default: return 'var(--primary-color)';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-right: var(--spacing-lg);
`;

const GoalInfo = styled.div`
  flex: 1;
`;

const GoalCategory = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const GoalDate = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  
  i {
    margin-right: var(--spacing-xs);
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
  line-height: 1.6;
`;

const ProgressContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
`;

const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  
  h3 {
    margin: 0;
    margin-right: var(--spacing-sm);
  }
  
  span {
    font-size: var(--font-size-medium);
    color: ${props => {
      if (props.progress === 100) return 'var(--success-color)';
      return 'var(--text-secondary)';
    }};
    font-weight: 600;
  }
`;

const ProgressBar = styled.div`
  height: 10px;
  background-color: var(--background-color);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => {
    if (props.progress === 100) return 'var(--success-color)';
    if (props.progress >= 75) return '#4cd964';
    if (props.progress >= 50) return '#ffcc00';
    if (props.progress >= 25) return '#ff9500';
    return '#ff3b30';
  }};
  transition: width var(--transition-normal);
`;

const CompletedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(76, 217, 100, 0.1);
  color: var(--success-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  
  i {
    margin-right: var(--spacing-xs);
  }
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.completed ? 'rgba(76, 217, 100, 0.1)' : 'var(--border-color)'};
  }
`;

const StepCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? 'var(--success-color)' : 'var(--border-color)'};
  background-color: ${props => props.completed ? 'var(--success-color)' : 'transparent'};
  margin-right: var(--spacing-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: ${props => props.completed ? 'var(--success-color)' : 'var(--primary-color)'};
  }
`;

const StepContent = styled.div`
  flex: 1;
  
  p {
    margin: 0;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    color: ${props => props.completed ? 'var(--text-secondary)' : 'var(--text-color)'};
  }
`;

const StepDate = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
`;

const CompleteGoalButton = styled(Button)`
  margin-top: var(--spacing-md);
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

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        setLoading(true);
        const response = await goalsApi.getGoal(id);
        setGoal(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching goal:', err);
        setError('Failed to load goal. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoal();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await goalsApi.deleteGoal(id);
      navigate('/goals');
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal. Please try again.');
      setDeleting(false);
    }
  };
  
  const toggleStepCompletion = async (stepId, currentStatus) => {
    try {
      setUpdating(true);
      
      const response = await goalsApi.updateStep(id, {
        stepId,
        isCompleted: !currentStatus
      });
      
      setGoal(response.data);
    } catch (err) {
      console.error('Error updating step:', err);
      setError('Failed to update step. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  const toggleGoalCompletion = async () => {
    try {
      setUpdating(true);
      
      const response = await goalsApi.updateGoal(id, {
        isCompleted: !goal.isCompleted
      });
      
      setGoal(response.data);
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Mental': return 'brain';
      case 'Physical': return 'dumbbell';
      case 'Social': return 'users';
      case 'Career': return 'briefcase';
      case 'Personal': return 'heart';
      default: return 'star';
    }
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingState>Loading goal...</LoadingState>
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
  
  if (!goal) {
    return (
      <Container>
        <ErrorState>Goal not found.</ErrorState>
      </Container>
    );
  }
  
  return (
    <DetailContainer>
      <Container>
        <PageHeader>
          <PageTitle>{goal.title}</PageTitle>
          <ButtonGroup>
            <Button 
              as={Link} 
              to={`/goals/${id}/edit`}
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
          <GoalHeader>
            <GoalIcon category={goal.category}>
              <i className={`fas fa-${getCategoryIcon(goal.category)}`}></i>
            </GoalIcon>
            <GoalInfo>
              <GoalCategory>{goal.category}</GoalCategory>
              {goal.targetDate && (
                <GoalDate>
                  <i className="far fa-calendar-alt"></i> Target: {formatDate(goal.targetDate)}
                </GoalDate>
              )}
            </GoalInfo>
            {goal.isCompleted && (
              <CompletedBadge>
                <i className="fas fa-check-circle"></i>
                Completed {goal.completedAt ? formatDate(goal.completedAt) : ''}
              </CompletedBadge>
            )}
          </GoalHeader>
          
          <DetailSection>
            <SectionTitle>Description</SectionTitle>
            <Description>{goal.description}</Description>
          </DetailSection>
          
          <ProgressContainer>
            <ProgressHeader>
              <ProgressLabel progress={goal.progress}>
                <h3>Progress</h3>
                <span>{goal.progress}%</span>
              </ProgressLabel>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill progress={goal.progress} />
            </ProgressBar>
          </ProgressContainer>
          
          <DetailSection>
            <SectionTitle>Steps</SectionTitle>
            <StepsList>
              {goal.steps.map(step => (
                <StepItem key={step._id} completed={step.isCompleted}>
                  <StepCheckbox 
                    completed={step.isCompleted}
                    onClick={() => toggleStepCompletion(step._id, step.isCompleted)}
                  >
                    {step.isCompleted && <i className="fas fa-check"></i>}
                  </StepCheckbox>
                  <StepContent completed={step.isCompleted}>
                    <p>{step.description}</p>
                    {step.completedAt && (
                      <StepDate>Completed on {formatDate(step.completedAt)}</StepDate>
                    )}
                  </StepContent>
                </StepItem>
              ))}
            </StepsList>
            
            <CompleteGoalButton
              onClick={toggleGoalCompletion}
              disabled={updating}
              variant={goal.isCompleted ? 'secondary' : 'success'}
            >
              {updating ? 'Updating...' : goal.isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}
            </CompleteGoalButton>
          </DetailSection>
          
          {showDeleteConfirmation && (
            <DeleteConfirmation>
              <ConfirmationTitle>Are you sure you want to delete this goal?</ConfirmationTitle>
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
            to="/goals"
            variant="secondary"
          >
            Back to Goals
          </Button>
        </div>
      </Container>
    </DetailContainer>
  );
};

export default GoalDetail;
