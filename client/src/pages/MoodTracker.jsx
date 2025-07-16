import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { moodApi } from '../utils/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodTrackerContainer = styled.div`
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

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: var(--spacing-xl);
`;

const FilterContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
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

const MoodEntriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const MoodEntryCard = styled(Card)`
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MoodLevel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  
  span {
    font-size: var(--font-size-xlarge);
    font-weight: 600;
    color: var(--primary-color);
    margin-right: var(--spacing-sm);
  }
  
  p {
    margin: 0;
    color: var(--text-secondary);
  }
`;

const MoodFactors = styled.div`
  margin-bottom: var(--spacing-md);
`;

const FactorTag = styled.span`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-sm);
  margin-right: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-small);
`;

const MoodActivities = styled.div`
  margin-bottom: var(--spacing-md);
`;

const ActivityTag = styled.span`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 113, 227, 0.1);
  color: var(--primary-color);
  border-radius: var(--border-radius-sm);
  margin-right: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-small);
`;

const MoodNotes = styled.p`
  color: var(--text-color);
  margin-bottom: 0;
  font-style: italic;
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

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [timeFilter, setTimeFilter] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        setLoading(true);
        const response = await moodApi.getMoods();
        setMoodEntries(response.data);
        setFilteredEntries(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching mood entries:', err);
        setError('Failed to load mood entries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMoodEntries();
  }, []);
  
  useEffect(() => {
    filterMoodEntries(timeFilter);
  }, [moodEntries, timeFilter]);
  
  const filterMoodEntries = (filter) => {
    const now = new Date();
    let filteredData = [];
    
    switch (filter) {
      case 'week':
        // Last 7 days
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= weekAgo);
        break;
      case 'month':
        // Last 30 days
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= monthAgo);
        break;
      case 'quarter':
        // Last 90 days
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= quarterAgo);
        break;
      case 'year':
        // Last 365 days
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= yearAgo);
        break;
      default:
        filteredData = moodEntries;
    }
    
    setFilteredEntries(filteredData);
  };
  
  // Prepare chart data
  const chartData = {
    labels: filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [
      {
        label: 'Mood Level',
        data: filteredEntries.map(entry => entry.mood).reverse(),
        borderColor: 'rgb(0, 113, 227)',
        backgroundColor: 'rgba(0, 113, 227, 0.5)',
        tension: 0.3
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Your Mood Trend (Last ${
          timeFilter === 'week' ? '7 days' :
          timeFilter === 'month' ? '30 days' :
          timeFilter === 'quarter' ? '90 days' :
          timeFilter === 'year' ? '365 days' : 'All time'
        })`
      }
    },
    scales: {
      y: {
        min: 1,
        max: 10,
        title: {
          display: true,
          text: 'Mood Level'
        }
      }
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
  
  return (
    <MoodTrackerContainer>
      <Container>
        <PageHeader>
          <PageTitle>Mood Tracker</PageTitle>
          <Button as={Link} to="/mood-tracker/new">
            <i className="fas fa-plus"></i> Track New Mood
          </Button>
        </PageHeader>
        
        {loading ? (
          <LoadingState>Loading mood data...</LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : moodEntries.length === 0 ? (
          <EmptyState>
            <h3>No mood entries yet</h3>
            <p>Start tracking your mood to see patterns and insights over time.</p>
            <Button as={Link} to="/mood-tracker/new">
              Track Your First Mood
            </Button>
          </EmptyState>
        ) : (
          <>
            <Card>
              <FilterContainer>
                <FilterButton 
                  active={timeFilter === 'week'} 
                  onClick={() => setTimeFilter('week')}
                >
                  Last 7 Days
                </FilterButton>
                <FilterButton 
                  active={timeFilter === 'month'} 
                  onClick={() => setTimeFilter('month')}
                >
                  Last 30 Days
                </FilterButton>
                <FilterButton 
                  active={timeFilter === 'quarter'} 
                  onClick={() => setTimeFilter('quarter')}
                >
                  Last 90 Days
                </FilterButton>
                <FilterButton 
                  active={timeFilter === 'year'} 
                  onClick={() => setTimeFilter('year')}
                >
                  Last Year
                </FilterButton>
                <FilterButton 
                  active={timeFilter === 'all'} 
                  onClick={() => setTimeFilter('all')}
                >
                  All Time
                </FilterButton>
              </FilterContainer>
              
              <ChartContainer>
                <Line data={chartData} options={chartOptions} />
              </ChartContainer>
            </Card>
            
            <h2 style={{ margin: 'var(--spacing-xl) 0 var(--spacing-md)' }}>Mood Entries</h2>
            
            <MoodEntriesContainer>
              {filteredEntries.map(entry => (
                <MoodEntryCard 
                  key={entry._id}
                  title={formatDate(entry.date)}
                  hoverable
                  clickable
                  as={Link}
                  to={`/mood-tracker/${entry._id}`}
                >
                  <MoodLevel>
                    <span>{entry.mood}/10</span>
                    <p>{getMoodDescription(entry.mood)}</p>
                  </MoodLevel>
                  
                  {entry.factors && entry.factors.length > 0 && (
                    <MoodFactors>
                      <h4>Factors:</h4>
                      {entry.factors.map((factor, index) => (
                        <FactorTag key={index}>
                          {factor.factor} ({factor.impact}/5)
                        </FactorTag>
                      ))}
                    </MoodFactors>
                  )}
                  
                  {entry.activities && entry.activities.length > 0 && (
                    <MoodActivities>
                      <h4>Activities:</h4>
                      {entry.activities.map((activity, index) => (
                        <ActivityTag key={index}>{activity}</ActivityTag>
                      ))}
                    </MoodActivities>
                  )}
                  
                  {entry.notes && (
                    <>
                      <h4>Notes:</h4>
                      <MoodNotes>
                        {entry.notes.length > 100 
                          ? `${entry.notes.substring(0, 100)}...` 
                          : entry.notes
                        }
                      </MoodNotes>
                    </>
                  )}
                </MoodEntryCard>
              ))}
            </MoodEntriesContainer>
          </>
        )}
      </Container>
    </MoodTrackerContainer>
  );
};

export default MoodTracker;
