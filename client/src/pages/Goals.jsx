import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { goalsApi } from '../utils/api';

const GoalsContainer = styled.div`
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

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const GoalCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const GoalIcon = styled.div`
  width: 40px;
  height: 40px;
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
  font-size: 1.2rem;
  margin-right: var(--spacing-md);
`;

const GoalInfo = styled.div`
  flex: 1;
`;

const GoalTitle = styled.h3`
  margin: 0 0 var(--spacing-xs);
  color: var(--text-color);
`;

const GoalCategory = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const GoalDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
`;

const ProgressContainer = styled.div`
  margin-top: auto;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  
  span {
    font-size: var(--font-size-small);
    color: var(--text-secondary);
  }
  
  span:last-child {
    font-weight: 600;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: var(--background-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
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

const DateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
`;

const CompletedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(76, 217, 100, 0.1);
  color: var(--success-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-sm);
  
  i {
    margin-right: var(--spacing-xs);
  }
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

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Available categories
  const categories = [
    'All',
    'Mental',
    'Physical',
    'Social',
    'Career',
    'Personal',
    'Other'
  ];
  
  // Available filters
  const filters = [
    'All',
    'In Progress',
    'Completed'
  ];
  
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await goalsApi.getGoals();
        setGoals(response.data);
        setFilteredGoals(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to load goals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, []);
  
  useEffect(() => {
    // Filter goals based on active category and filter
    let filtered = goals;
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(goal => goal.category === activeCategory);
    }
    
    // Filter by completion status
    if (activeFilter === 'Completed') {
      filtered = filtered.filter(goal => goal.isCompleted);
    } else if (activeFilter === 'In Progress') {
      filtered = filtered.filter(goal => !goal.isCompleted);
    }
    
    setFilteredGoals(filtered);
  }, [activeCategory, activeFilter, goals]);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
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
      <GoalsContainer>
        <Container>
          <PageHeader>
            <PageTitle>Goals</PageTitle>
            <Button as={Link} to="/goals/new">
              <i className="fas fa-plus"></i> New Goal
            </Button>
          </PageHeader>
          <LoadingState>Loading goals...</LoadingState>
        </Container>
      </GoalsContainer>
    );
  }
  
  if (error) {
    return (
      <GoalsContainer>
        <Container>
          <PageHeader>
            <PageTitle>Goals</PageTitle>
            <Button as={Link} to="/goals/new">
              <i className="fas fa-plus"></i> New Goal
            </Button>
          </PageHeader>
          <ErrorState>{error}</ErrorState>
        </Container>
      </GoalsContainer>
    );
  }
  
  return (
    <GoalsContainer>
      <Container>
        <PageHeader>
          <PageTitle>Goals</PageTitle>
          <Button as={Link} to="/goals/new">
            <i className="fas fa-plus"></i> New Goal
          </Button>
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
        
        <FiltersContainer>
          {filters.map(filter => (
            <FilterButton
              key={filter}
              active={activeFilter === filter}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </FilterButton>
          ))}
        </FiltersContainer>
        
        {filteredGoals.length === 0 ? (
          <EmptyState>
            <h3>No goals found</h3>
            <p>
              {goals.length === 0
                ? 'Start setting goals to track your mental health journey.'
                : 'No goals match your current filters. Try adjusting your filters.'}
            </p>
            <Button as={Link} to="/goals/new">
              Create Your First Goal
            </Button>
          </EmptyState>
        ) : (
          <GoalsGrid>
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal._id}
                hoverable
                clickable
                as={Link}
                to={`/goals/${goal._id}`}
              >
                <GoalHeader>
                  <GoalIcon category={goal.category}>
                    <i className={`fas fa-${getCategoryIcon(goal.category)}`}></i>
                  </GoalIcon>
                  <GoalInfo>
                    <GoalTitle>{goal.title}</GoalTitle>
                    <GoalCategory>{goal.category}</GoalCategory>
                  </GoalInfo>
                </GoalHeader>
                
                {goal.isCompleted && (
                  <CompletedBadge>
                    <i className="fas fa-check-circle"></i>
                    Completed
                  </CompletedBadge>
                )}
                
                <GoalDescription>
                  {goal.description.length > 100
                    ? `${goal.description.substring(0, 100)}...`
                    : goal.description}
                </GoalDescription>
                
                <ProgressContainer>
                  <ProgressLabel>
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </ProgressLabel>
                  <ProgressBar>
                    <ProgressFill progress={goal.progress} />
                  </ProgressBar>
                  <DateInfo>
                    <span>
                      <i className="far fa-calendar-alt"></i> {formatDate(goal.targetDate)}
                    </span>
                    <span>
                      {goal.steps.length} {goal.steps.length === 1 ? 'step' : 'steps'}
                    </span>
                  </DateInfo>
                </ProgressContainer>
              </GoalCard>
            ))}
          </GoalsGrid>
        )}
      </Container>
    </GoalsContainer>
  );
};

export default Goals;
