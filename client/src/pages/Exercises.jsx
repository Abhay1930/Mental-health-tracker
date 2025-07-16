import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { exercisesApi } from '../utils/api';

const ExercisesContainer = styled.div`
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

const FiltersContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  }
`;

const ExercisesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const ExerciseCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ExerciseIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: var(--spacing-md);
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseTitle = styled.h3`
  margin: 0 0 var(--spacing-xs);
`;

const ExerciseMeta = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  
  span {
    display: flex;
    align-items: center;
    margin-right: var(--spacing-md);
    
    i {
      margin-right: var(--spacing-xs);
    }
  }
`;

const ExerciseDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
`;

const BenefitsList = styled.div`
  margin-top: auto;
`;

const BenefitTag = styled.span`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  margin-right: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  
  h3 {
    margin-bottom: var(--spacing-md);
  }
  
  p {
    margin-bottom: var(--spacing-lg);
    color: var(--text-secondary);
  }
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

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Available categories
  const categories = [
    'All',
    'Meditation',
    'Breathing',
    'Physical',
    'Cognitive',
    'Mindfulness',
    'Other'
  ];
  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await exercisesApi.getExercises();
        setExercises(response.data);
        setFilteredExercises(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercises();
  }, []);
  
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(exercise => exercise.category === activeCategory));
    }
  }, [activeCategory, exercises]);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Meditation':
        return 'spa';
      case 'Breathing':
        return 'wind';
      case 'Physical':
        return 'dumbbell';
      case 'Cognitive':
        return 'brain';
      case 'Mindfulness':
        return 'leaf';
      default:
        return 'star';
    }
  };
  
  if (loading) {
    return (
      <ExercisesContainer>
        <Container>
          <PageHeader>
            <PageTitle>Mindfulness Exercises</PageTitle>
            <PageDescription>
              Explore exercises and activities to improve your mental wellbeing.
            </PageDescription>
          </PageHeader>
          <LoadingState>Loading exercises...</LoadingState>
        </Container>
      </ExercisesContainer>
    );
  }
  
  if (error) {
    return (
      <ExercisesContainer>
        <Container>
          <PageHeader>
            <PageTitle>Mindfulness Exercises</PageTitle>
            <PageDescription>
              Explore exercises and activities to improve your mental wellbeing.
            </PageDescription>
          </PageHeader>
          <ErrorState>{error}</ErrorState>
        </Container>
      </ExercisesContainer>
    );
  }
  
  return (
    <ExercisesContainer>
      <Container>
        <PageHeader>
          <PageTitle>Mindfulness Exercises</PageTitle>
          <PageDescription>
            Explore exercises and activities to improve your mental wellbeing.
          </PageDescription>
        </PageHeader>
        
        <FiltersContainer>
          {categories.map(category => (
            <FilterButton
              key={category}
              active={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FiltersContainer>
        
        {filteredExercises.length === 0 ? (
          <EmptyState>
            <h3>No exercises found</h3>
            <p>
              {activeCategory === 'All'
                ? 'There are no exercises available at the moment.'
                : `There are no ${activeCategory} exercises available at the moment.`}
            </p>
            {activeCategory !== 'All' && (
              <Button onClick={() => setActiveCategory('All')}>
                View All Exercises
              </Button>
            )}
          </EmptyState>
        ) : (
          <ExercisesGrid>
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise._id}
                hoverable
                clickable
                as={Link}
                to={`/exercises/${exercise._id}`}
              >
                <ExerciseHeader>
                  <ExerciseIcon>
                    <i className={`fas fa-${getCategoryIcon(exercise.category)}`}></i>
                  </ExerciseIcon>
                  <ExerciseInfo>
                    <ExerciseTitle>{exercise.title}</ExerciseTitle>
                    <ExerciseMeta>
                      <span>
                        <i className="far fa-clock"></i>
                        {exercise.duration} min
                      </span>
                      <span>{exercise.category}</span>
                    </ExerciseMeta>
                  </ExerciseInfo>
                </ExerciseHeader>
                
                <ExerciseDescription>
                  {exercise.description.length > 120
                    ? `${exercise.description.substring(0, 120)}...`
                    : exercise.description}
                </ExerciseDescription>
                
                {exercise.benefits && exercise.benefits.length > 0 && (
                  <BenefitsList>
                    <h4>Benefits:</h4>
                    {exercise.benefits.map((benefit, index) => (
                      <BenefitTag key={index}>{benefit}</BenefitTag>
                    ))}
                  </BenefitsList>
                )}
              </ExerciseCard>
            ))}
          </ExercisesGrid>
        )}
      </Container>
    </ExercisesContainer>
  );
};

export default Exercises;
