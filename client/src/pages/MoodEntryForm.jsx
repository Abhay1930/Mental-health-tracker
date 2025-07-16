import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Container from '../components/common/Container';
import { moodApi } from '../utils/api';

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

const SectionDivider = styled.div`
  height: 1px;
  background-color: var(--border-color);
  margin: var(--spacing-lg) 0;
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

const ActivitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const ActivityTag = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.selected ? 'white' : 'var(--text-color)'};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  }
`;

const FactorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FactorItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FactorInput = styled(Input)`
  flex: 1;
`;

const FactorRating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const RatingButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.selected ? 'white' : 'var(--text-color)'};
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--background-color)'};
  }
`;

const AddButton = styled(Button)`
  align-self: flex-start;
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

const MoodEntryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    mood: 5,
    activities: [],
    factors: [{ factor: '', impact: 3 }],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  // Common activities
  const commonActivities = [
    'Exercise', 'Reading', 'Meditation', 'Work', 'Study',
    'Social Event', 'Family Time', 'Hobby', 'TV/Movies', 'Gaming',
    'Outdoors', 'Shopping', 'Cooking', 'Cleaning', 'Travel'
  ];

  useEffect(() => {
    // If in edit mode, fetch the mood entry
    if (isEditMode) {
      const fetchMoodEntry = async () => {
        try {
          setInitialLoading(true);
          const response = await moodApi.getMood(id);

          // Format the data
          const moodData = response.data;

          // Ensure factors has the correct format
          const factors = moodData.factors && moodData.factors.length > 0
            ? moodData.factors
            : [{ factor: '', impact: 3 }];

          setFormData({
            mood: moodData.mood || 5,
            activities: moodData.activities || [],
            factors,
            notes: moodData.notes || ''
          });

          setError(null);
        } catch (err) {
          console.error('Error fetching mood entry:', err);
          setError('Failed to load mood entry. Please try again.');
        } finally {
          setInitialLoading(false);
        }
      };

      fetchMoodEntry();
    }
  }, [id, isEditMode]);

  const handleMoodChange = (e) => {
    setFormData({
      ...formData,
      mood: parseInt(e.target.value, 10)
    });
  };

  const handleActivityToggle = (activity) => {
    setFormData(prevData => {
      const activities = [...prevData.activities];

      if (activities.includes(activity)) {
        // Remove activity
        return {
          ...prevData,
          activities: activities.filter(a => a !== activity)
        };
      } else {
        // Add activity
        return {
          ...prevData,
          activities: [...activities, activity]
        };
      }
    });
  };

  const handleFactorChange = (index, field, value) => {
    setFormData(prevData => {
      const factors = [...prevData.factors];
      factors[index] = {
        ...factors[index],
        [field]: value
      };

      return {
        ...prevData,
        factors
      };
    });
  };

  const addFactor = () => {
    setFormData(prevData => ({
      ...prevData,
      factors: [...prevData.factors, { factor: '', impact: 3 }]
    }));
  };

  const removeFactor = (index) => {
    setFormData(prevData => {
      const factors = [...prevData.factors];
      factors.splice(index, 1);

      return {
        ...prevData,
        factors: factors.length > 0 ? factors : [{ factor: '', impact: 3 }]
      };
    });
  };

  const handleNotesChange = (e) => {
    setFormData({
      ...formData,
      notes: e.target.value
    });
  };

  const validateForm = () => {
    // Basic validation
    if (formData.mood < 1 || formData.mood > 10) {
      setError('Mood level must be between 1 and 10');
      return false;
    }

    // Validate factors (if any non-empty factor exists)
    const hasFactors = formData.factors.some(f => f.factor.trim() !== '');

    if (hasFactors) {
      // Check if any factor has an empty name
      const hasEmptyFactor = formData.factors.some(f => f.factor.trim() === '' && f.impact > 0);

      if (hasEmptyFactor) {
        setError('Please provide a name for all factors or remove them');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out empty factors
    const cleanedFormData = {
      ...formData,
      factors: formData.factors.filter(f => f.factor.trim() !== '')
    };

    setLoading(true);

    try {
      if (isEditMode) {
        await moodApi.updateMood(id, cleanedFormData);
      } else {
        await moodApi.createMood(cleanedFormData);
      }

      navigate('/mood-tracker');
    } catch (err) {
      console.error('Error saving mood entry:', err);
      setError('Failed to save mood entry. Please try again.');
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
        <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
          Loading mood entry...
        </div>
      </Container>
    );
  }

  return (
    <FormContainer>
      <Container>
        <PageHeader>
          <PageTitle>{isEditMode ? 'Edit Mood Entry' : 'Track Your Mood'}</PageTitle>
          <PageDescription>
            Record how you're feeling and what factors are affecting your mood.
          </PageDescription>
        </PageHeader>

        <Card>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
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
              <SectionTitle>Energy Level</SectionTitle>
              <SectionDescription>
                Rate your energy level from 1 (extremely low) to 10 (extremely high).
              </SectionDescription>

              <MoodSlider>
                <SliderContainer>
                  <SliderValue>{formData.energy}</SliderValue>
                  <Slider
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energy}
                    onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value, 10)})}
                  />
                </SliderContainer>
              </MoodSlider>
            </FormSection>

            <FormSection>
              <SectionTitle>Anxiety Level</SectionTitle>
              <SectionDescription>
                Rate your anxiety level from 1 (none) to 10 (severe).
              </SectionDescription>

              <MoodSlider>
                <SliderContainer>
                  <SliderValue>{formData.anxiety}</SliderValue>
                  <Slider
                    type="range"
                    min="1"
                    max="10"
                    value={formData.anxiety}
                    onChange={(e) => setFormData({...formData, anxiety: parseInt(e.target.value, 10)})}
                  />
                </SliderContainer>
              </MoodSlider>
            </FormSection>

            <SectionDivider />

            <FormSection>
              <SectionTitle>What activities have you done today?</SectionTitle>
              <SectionDescription>
                Select the activities that you've engaged in today.
              </SectionDescription>

              <ActivitiesContainer>
                {commonActivities.map(activity => (
                  <ActivityTag
                    key={activity}
                    selected={formData.activities.includes(activity)}
                    onClick={() => handleActivityToggle(activity)}
                  >
                    {activity}
                  </ActivityTag>
                ))}
              </ActivitiesContainer>
            </FormSection>

            <FormSection>
              <SectionTitle>What factors are affecting your mood?</SectionTitle>
              <SectionDescription>
                Add factors that are influencing your mood and rate their impact from 1 (minimal) to 5 (significant).
              </SectionDescription>

              <FactorsContainer>
                {formData.factors.map((factor, index) => (
                  <FactorItem key={index}>
                    <FactorInput
                      placeholder="Enter a factor (e.g., Sleep, Work, Relationship)"
                      value={factor.factor}
                      onChange={(e) => handleFactorChange(index, 'factor', e.target.value)}
                    />

                    <FactorRating>
                      <span>Impact:</span>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <RatingButton
                          key={rating}
                          type="button"
                          selected={factor.impact === rating}
                          onClick={() => handleFactorChange(index, 'impact', rating)}
                        >
                          {rating}
                        </RatingButton>
                      ))}
                    </FactorRating>

                    {formData.factors.length > 1 && (
                      <RemoveButton
                        type="button"
                        onClick={() => removeFactor(index)}
                      >
                        <i className="fas fa-times"></i>
                      </RemoveButton>
                    )}
                  </FactorItem>
                ))}
              </FactorsContainer>

              <AddButton
                type="button"
                variant="secondary"
                size="small"
                onClick={addFactor}
              >
                <i className="fas fa-plus"></i> Add Factor
              </AddButton>
            </FormSection>

            <SectionDivider />

            <FormSection>
              <SectionTitle>Lifestyle Factors</SectionTitle>
              <SectionDescription>
                Track important lifestyle factors that may affect your mental health.
              </SectionDescription>

              <FormSection>
                <SectionTitle>Hours of Sleep</SectionTitle>
                <SliderContainer style={{ marginBottom: 'var(--spacing-md)' }}>
                  <SliderValue>{formData.sleepHours}</SliderValue>
                  <Slider
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value)})}
                  />
                </SliderContainer>
              </FormSection>

              <FormSection>
                <SectionTitle>Physical Activity (minutes)</SectionTitle>
                <Input
                  type="number"
                  min="0"
                  placeholder="Minutes of physical activity"
                  value={formData.physicalActivity}
                  onChange={(e) => setFormData({...formData, physicalActivity: parseInt(e.target.value) || 0})}
                />
              </FormSection>

              <FormSection>
                <SectionTitle>Social Interaction (hours)</SectionTitle>
                <SliderContainer style={{ marginBottom: 'var(--spacing-md)' }}>
                  <SliderValue>{formData.socialInteraction}</SliderValue>
                  <Slider
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={formData.socialInteraction}
                    onChange={(e) => setFormData({...formData, socialInteraction: parseFloat(e.target.value)})}
                  />
                </SliderContainer>
              </FormSection>
            </FormSection>

            <SectionDivider />

            <FormSection>
              <SectionTitle>Additional Notes</SectionTitle>
              <SectionDescription>
                Add any additional thoughts or context about your mood today.
              </SectionDescription>

              <Input
                as="textarea"
                rows="4"
                placeholder="Write your thoughts here..."
                value={formData.notes}
                onChange={handleNotesChange}
              />
            </FormSection>

            <ButtonGroup>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Mood' : 'Save Mood'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/mood-tracker')}
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

export default MoodEntryForm;
