import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Container from '../components/common/Container';
import { goalsApi } from '../utils/api';

const FormContainer = styled.div`
  padding: var(--spacing-lg) 0;
`;

const PageHeader = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const PageTitle = styled.h1`
  margin-bottom: var(--spacing-xs);
`;

const PageDescription = styled.p`
  color: var(--text-secondary);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormSection = styled.div`
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h3`
  margin-bottom: var(--spacing-sm);
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
`;

const CategorySelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
`;

const CategoryButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.selected ? 'rgba(0, 113, 227, 0.1)' : 'var(--card-background)'};
  color: ${props => props.selected ? 'var(--primary-color)' : 'var(--text-color)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  width: calc(33.333% - var(--spacing-sm));
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(0, 113, 227, 0.1)' : 'var(--background-color)'};
  }
  
  i {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-xs);
  }
  
  @media (max-width: 768px) {
    width: calc(50% - var(--spacing-sm));
  }
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
`;

const StepInput = styled(Input)`
  flex: 1;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  font-size: 1.2rem;
  padding: var(--spacing-xs);
  
  &:hover {
    opacity: 0.8;
  }
`;

const AddButton = styled(Button)`
  align-self: flex-start;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--error-color);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const GoalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    steps: [{ description: '', isCompleted: false }],
    targetDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  // Available categories
  const categories = [
    { name: 'Mental', icon: 'brain' },
    { name: 'Physical', icon: 'dumbbell' },
    { name: 'Social', icon: 'users' },
    { name: 'Career', icon: 'briefcase' },
    { name: 'Personal', icon: 'heart' },
    { name: 'Other', icon: 'star' }
  ];
  
  useEffect(() => {
    // If in edit mode, fetch the goal
    if (isEditMode) {
      const fetchGoal = async () => {
        try {
          setInitialLoading(true);
          const response = await goalsApi.getGoal(id);
          
          // Format the date for the input field
          const targetDate = response.data.targetDate 
            ? new Date(response.data.targetDate).toISOString().split('T')[0]
            : '';
          
          setFormData({
            title: response.data.title || '',
            description: response.data.description || '',
            category: response.data.category || '',
            steps: response.data.steps && response.data.steps.length > 0 
              ? response.data.steps 
              : [{ description: '', isCompleted: false }],
            targetDate
          });
          
          setError(null);
        } catch (err) {
          console.error('Error fetching goal:', err);
          setError('Failed to load goal. Please try again.');
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchGoal();
    }
  }, [id, isEditMode]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };
  
  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category
    });
    
    // Clear error when user selects a category
    if (error) {
      setError(null);
    }
  };
  
  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index].description = value;
    
    setFormData({
      ...formData,
      steps: updatedSteps
    });
    
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };
  
  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { description: '', isCompleted: false }]
    });
  };
  
  const removeStep = (index) => {
    const updatedSteps = [...formData.steps];
    updatedSteps.splice(index, 1);
    
    setFormData({
      ...formData,
      steps: updatedSteps.length > 0 ? updatedSteps : [{ description: '', isCompleted: false }]
    });
  };
  
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    
    // Check if at least one step has a description
    const hasValidStep = formData.steps.some(step => step.description.trim() !== '');
    if (!hasValidStep) {
      setError('Please add at least one step');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Filter out empty steps
    const cleanedFormData = {
      ...formData,
      steps: formData.steps.filter(step => step.description.trim() !== '')
    };
    
    setLoading(true);
    
    try {
      if (isEditMode) {
        await goalsApi.updateGoal(id, cleanedFormData);
      } else {
        await goalsApi.createGoal(cleanedFormData);
      }
      
      navigate('/goals');
    } catch (err) {
      console.error('Error saving goal:', err);
      setError('Failed to save goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <Container>
        <LoadingState>Loading goal...</LoadingState>
      </Container>
    );
  }
  
  return (
    <FormContainer>
      <Container>
        <PageHeader>
          <PageTitle>{isEditMode ? 'Edit Goal' : 'Create New Goal'}</PageTitle>
          <PageDescription>
            Set clear, achievable goals to improve your mental health and track your progress.
          </PageDescription>
        </PageHeader>
        
        <Card>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleSubmit}>
            <Input
              id="title"
              name="title"
              label="Goal Title"
              placeholder="What do you want to achieve?"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            
            <FormSection>
              <SectionTitle>Description</SectionTitle>
              <SectionDescription>
                Describe your goal in detail. What do you want to achieve and why is it important to you?
              </SectionDescription>
              
              <Input
                as="textarea"
                id="description"
                name="description"
                rows="4"
                placeholder="Describe your goal..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>Category</SectionTitle>
              <SectionDescription>
                Select a category that best describes your goal.
              </SectionDescription>
              
              <CategorySelector>
                {categories.map(category => (
                  <CategoryButton
                    key={category.name}
                    type="button"
                    selected={formData.category === category.name}
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    <i className={`fas fa-${category.icon}`}></i>
                    {category.name}
                  </CategoryButton>
                ))}
              </CategorySelector>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Steps to Achieve Your Goal</SectionTitle>
              <SectionDescription>
                Break down your goal into smaller, manageable steps.
              </SectionDescription>
              
              <StepsContainer>
                {formData.steps.map((step, index) => (
                  <StepItem key={index}>
                    <StepNumber>{index + 1}</StepNumber>
                    <StepInput
                      placeholder={`Step ${index + 1}: What needs to be done?`}
                      value={step.description}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                    />
                    {formData.steps.length > 1 && (
                      <RemoveButton 
                        type="button"
                        onClick={() => removeStep(index)}
                      >
                        <i className="fas fa-times"></i>
                      </RemoveButton>
                    )}
                  </StepItem>
                ))}
              </StepsContainer>
              
              <AddButton 
                type="button"
                variant="secondary"
                size="small"
                onClick={addStep}
              >
                <i className="fas fa-plus"></i> Add Step
              </AddButton>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Target Date</SectionTitle>
              <SectionDescription>
                When do you aim to complete this goal? (Optional)
              </SectionDescription>
              
              <Input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleInputChange}
              />
            </FormSection>
            
            <ButtonGroup>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Goal' : 'Create Goal'}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/goals')}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Form>
        </Card>
      </Container>
    </FormContainer>
  );
};

export default GoalForm;
