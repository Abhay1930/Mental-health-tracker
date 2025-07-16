import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Container from '../components/common/Container';
import { journalApi } from '../utils/api';

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

const MoodSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #ff6b6b, #ffcc5c, #88d8b0);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px var(--shadow-color);
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px var(--shadow-color);
  }
`;

const SliderValue = styled.div`
  font-size: var(--font-size-xlarge);
  font-weight: 600;
  color: var(--primary-color);
  width: 60px;
  text-align: center;
`;

const MoodDescription = styled.div`
  text-align: center;
  font-weight: 500;
  color: ${props => {
    if (props.value >= 9) return '#4cd964'; // Excellent
    if (props.value >= 7) return '#5ac8fa'; // Good
    if (props.value >= 5) return '#ffcc00'; // Neutral
    if (props.value >= 3) return '#ff9500'; // Poor
    return '#ff3b30'; // Very Poor
  }};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const TagInput = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  input {
    flex: 1;
  }
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.selected ? 'white' : 'var(--text-color)'};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  
  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    margin-left: var(--spacing-xs);
    padding: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PrivacyToggle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${props => props.checked ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 12px;
  transition: background-color var(--transition-fast);
  margin-right: var(--spacing-sm);
  
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: ${props => props.checked ? '28px' : '2px'};
    transition: left var(--transition-fast);
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
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

const JournalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    mood: 5,
    isPrivate: true
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  // Common tags suggestions
  const commonTags = [
    'Anxiety', 'Depression', 'Stress', 'Work', 'Family', 
    'Relationships', 'Self-care', 'Gratitude', 'Goals', 'Progress'
  ];
  
  useEffect(() => {
    // If in edit mode, fetch the journal entry
    if (isEditMode) {
      const fetchJournal = async () => {
        try {
          setInitialLoading(true);
          const response = await journalApi.getJournal(id);
          
          setFormData({
            title: response.data.title || '',
            content: response.data.content || '',
            tags: response.data.tags || [],
            mood: response.data.mood || 5,
            isPrivate: response.data.isPrivate !== undefined ? response.data.isPrivate : true
          });
          
          setError(null);
        } catch (err) {
          console.error('Error fetching journal entry:', err);
          setError('Failed to load journal entry. Please try again.');
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchJournal();
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
  
  const handleMoodChange = (e) => {
    setFormData({
      ...formData,
      mood: parseInt(e.target.value, 10)
    });
  };
  
  const handleTagInputChange = (e) => {
    setNewTag(e.target.value);
  };
  
  const addTag = () => {
    if (newTag.trim() === '') return;
    
    if (!formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
    }
    
    setNewTag('');
  };
  
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const toggleCommonTag = (tag) => {
    if (formData.tags.includes(tag)) {
      // Remove tag
      removeTag(tag);
    } else {
      // Add tag
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };
  
  const togglePrivacy = () => {
    setFormData({
      ...formData,
      isPrivate: !formData.isPrivate
    });
  };
  
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditMode) {
        await journalApi.updateJournal(id, formData);
      } else {
        await journalApi.createJournal(formData);
      }
      
      navigate('/journal');
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getMoodDescription = (level) => {
    if (level >= 9) return 'Excellent';
    if (level >= 7) return 'Good';
    if (level >= 5) return 'Neutral';
    if (level >= 3) return 'Poor';
    return 'Very Poor';
  };
  
  if (initialLoading) {
    return (
      <Container>
        <LoadingState>Loading journal entry...</LoadingState>
      </Container>
    );
  }
  
  return (
    <FormContainer>
      <Container>
        <PageHeader>
          <PageTitle>{isEditMode ? 'Edit Journal Entry' : 'New Journal Entry'}</PageTitle>
          <PageDescription>
            Write down your thoughts, feelings, and experiences to track your mental health journey.
          </PageDescription>
        </PageHeader>
        
        <Card>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleSubmit}>
            <Input
              id="title"
              name="title"
              label="Title"
              placeholder="Give your entry a title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            
            <FormSection>
              <SectionTitle>How are you feeling today?</SectionTitle>
              <SectionDescription>
                Rate your mood on a scale from 1 (very poor) to 10 (excellent).
              </SectionDescription>
              
              <MoodSlider>
                <SliderContainer>
                  <SliderValue>{formData.mood}</SliderValue>
                  <Slider 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={formData.mood} 
                    onChange={handleMoodChange}
                  />
                </SliderContainer>
                <MoodDescription value={formData.mood}>
                  {getMoodDescription(formData.mood)}
                </MoodDescription>
              </MoodSlider>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Journal Entry</SectionTitle>
              <SectionDescription>
                Write about your thoughts, feelings, and experiences.
              </SectionDescription>
              
              <Input
                as="textarea"
                id="content"
                name="content"
                rows="10"
                placeholder="Start writing here..."
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>Tags</SectionTitle>
              <SectionDescription>
                Add tags to categorize your journal entry.
              </SectionDescription>
              
              <TagInput>
                <Input
                  id="newTag"
                  placeholder="Add a tag (press Enter)"
                  value={newTag}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagKeyPress}
                />
                <Button 
                  type="button"
                  onClick={addTag}
                  variant="secondary"
                >
                  Add
                </Button>
              </TagInput>
              
              <SectionTitle>Common Tags</SectionTitle>
              <TagsContainer>
                {commonTags.map(tag => (
                  <Tag 
                    key={tag}
                    selected={formData.tags.includes(tag)}
                    onClick={() => toggleCommonTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </TagsContainer>
              
              {formData.tags.length > 0 && (
                <>
                  <SectionTitle>Your Tags</SectionTitle>
                  <TagsContainer>
                    {formData.tags.map(tag => (
                      <Tag key={tag} selected>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </Tag>
                    ))}
                  </TagsContainer>
                </>
              )}
            </FormSection>
            
            <FormSection>
              <SectionTitle>Privacy</SectionTitle>
              <SectionDescription>
                Choose whether this entry is private or can be shared with your support network.
              </SectionDescription>
              
              <PrivacyToggle>
                <ToggleLabel>
                  <ToggleInput
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={togglePrivacy}
                  />
                  <ToggleSwitch checked={formData.isPrivate} />
                  Private Entry
                </ToggleLabel>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {formData.isPrivate 
                    ? 'Only you can see this entry' 
                    : 'This entry can be shared with your support network'}
                </span>
              </PrivacyToggle>
            </FormSection>
            
            <ButtonGroup>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Entry' : 'Save Entry'}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/journal')}
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

export default JournalForm;
