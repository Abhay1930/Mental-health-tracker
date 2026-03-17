import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  padding: 0;
`;

const PageHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--wellness-gradient);
  border-radius: var(--border-radius-xl);
  color: white;
  box-shadow: var(--shadow-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const PageHeaderInfo = styled.div``;

const PageTitle = styled.h1`
  margin-bottom: var(--spacing-xs);
  font-size: 2.5rem;
  color: white;
`;

const PageSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
`;

const ChartSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;

  i {
    background: var(--wellness-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--primary-color);
    color: ${props => props.$active ? 'white' : 'var(--primary-color)'};
  }
`;

const MoodEntriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--spacing-lg);
`;

const MoodEntryCard = styled(Card)`
  padding: 0;
  overflow: hidden;

  &:hover {
    border-color: var(--primary-light);
  }
`;

const EntryHeader = styled.div`
  padding: var(--spacing-md);
  background: rgba(99, 102, 241, 0.03);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .date {
    font-weight: 700;
    color: var(--text-color);
  }
`;

const MoodBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$color || 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  box-shadow: 0 4px 10px -2px ${props => props.$color}55;
`;

const EntryContent = styled.div`
  padding: var(--spacing-md);
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--spacing-sm);
`;

const Tag = styled.span`
  font-size: 0.75rem;
  padding: 4px 10px;
  background: var(--background-color);
  color: var(--text-secondary);
  border-radius: 14px;
  border: 1px solid var(--border-color);
  font-weight: 500;
`;

const MoodNotes = styled.p`
  color: var(--text-color);
  margin-top: var(--spacing-md);
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ForecastCard = styled.div`
  background: var(--card-background);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-light);
  }

  h4 {
    color: var(--text-secondary);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: var(--spacing-sm);
  }

  .score {
    font-size: 2.5rem;
    font-weight: 800;
    font-family: var(--font-heading);
    color: var(--primary-color);
    line-height: 1;
    margin-bottom: 4px;
    display: block;
  }

  .label {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-color);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  border: 1px dashed var(--border-color);
  
  i {
    font-size: 3rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  gap: var(--spacing-md);
`;

const ErrorState = styled.div`
  padding: var(--spacing-md);
  color: var(--error-color);
  text-align: center;
`;

const MoodTracker = () => {
  const navigate = useNavigate();
  const [moodEntries, setMoodEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [futurePrediction, setFuturePrediction] = useState(null);
  const [timeFilter, setTimeFilter] = useState('week');
  const [loading, setLoading] = useState(true);
  const [predictLoading, setPredictLoading] = useState(false);
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

    const fetchFuturePrediction = async () => {
      try {
        setPredictLoading(true);
        const response = await moodApi.getFuturePrediction();
        setFuturePrediction(response.data);
      } catch (err) {
        console.error('Error fetching future prediction:', err);
      } finally {
        setPredictLoading(false);
      }
    };
    
    fetchMoodEntries();
    fetchFuturePrediction();
  }, []);
  
  useEffect(() => {
    filterMoodEntries(timeFilter);
  }, [moodEntries, timeFilter]);
  
  const filterMoodEntries = (filter) => {
    const now = new Date();
    let filteredData = [];
    
    switch (filter) {
      case 'week':

        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= weekAgo);
        break;
      case 'month':

        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= monthAgo);
        break;
      case 'quarter':

        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= quarterAgo);
        break;
      case 'year':

        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredData = moodEntries.filter(entry => new Date(entry.date) >= yearAgo);
        break;
      default:
        filteredData = moodEntries;
    }
    
    setFilteredEntries(filteredData);
  };

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

  const getMoodColor = (level) => {
    if (level >= 9) return '#10b981'; // emerald green
    if (level >= 7) return '#6366f1'; // indigo
    if (level >= 5) return '#f59e0b'; // amber
    if (level >= 3) return '#f97316'; // orange
    return '#ef4444';                 // red
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
          <>            <PageHeader>
              <PageHeaderInfo>
                <PageTitle>Mood Journey</PageTitle>
                <PageSubtitle>Reflect on your patterns and discover new insights.</PageSubtitle>
              </PageHeaderInfo>
              <Button onClick={() => navigate('/mood-tracker/new')}>
                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Log Today's Mood
              </Button>
            </PageHeader>

            <ChartSection>
              <Card>
                <ChartHeader>
                  <SectionTitle>
                    <i className="fas fa-chart-line"></i> Mood Trends
                  </SectionTitle>
                  <FilterContainer>
                    {['week', 'month', 'quarter', 'all'].map(filter => (
                      <FilterButton 
                        key={filter}
                        $active={timeFilter === filter}
                        onClick={() => setTimeFilter(filter)}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </FilterButton>
                    ))}
                  </FilterContainer>
                </ChartHeader>
                <ChartContainer>
                  <Line data={chartData} options={chartOptions} />
                </ChartContainer>
              </Card>
            </ChartSection>

            {/* Mood Forecast Section */}
            <SectionTitle style={{ marginBottom: 'var(--spacing-md)' }}>
              <i className="fas fa-magic"></i> AI Mood Forecast
            </SectionTitle>
            
            {predictLoading ? (
              <Card>
                <LoadingState>
                  <i className="fas fa-spinner fa-spin fa-2x"></i>
                  <p>Analyzing your emotional patterns...</p>
                </LoadingState>
              </Card>
            ) : futurePrediction ? (
              <ForecastGrid>
                {['next_day', '3_days', '7_days'].map((key) => {
                  const labelMap = { 'next_day': 'Tomorrow', '3_days': 'In 3 Days', '7_days': 'In 7 Days' };
                  const data = futurePrediction[key];
                  return (
                    <ForecastCard key={key}>
                      <h4>{labelMap[key]}</h4>
                      <div className="score">{data?.score}</div>
                      <div className="label">{data?.label}</div>
                    </ForecastCard>
                  );
                })}
              </ForecastGrid>
            ) : (
              <Card>
                <EmptyState>
                  <i className="fas fa-brain"></i>
                  <p>Check back after adding more mood entries for a personalized AI forecast.</p>
                </EmptyState>
              </Card>
            )}
            
            <SectionTitle style={{ margin: 'var(--spacing-xl) 0 var(--spacing-md)' }}>
              <i className="fas fa-history"></i> Recent Entries
            </SectionTitle>
            
            <MoodEntriesContainer>
              {filteredEntries.map(entry => (
                <MoodEntryCard 
                  key={entry._id}
                  $hoverable
                  $clickable
                  as={Link}
                  to={`/mood-tracker/${entry._id}`}
                >
                  <EntryHeader>
                    <span className="date">{formatDate(entry.date)}</span>
                    <MoodBadge $color={getMoodColor(entry.mood)}>
                      {entry.mood}
                    </MoodBadge>
                  </EntryHeader>
                  
                  <EntryContent>
                    <p style={{ fontWeight: 600, color: 'var(--text-color)', marginBottom: '8px' }}>
                      {getMoodDescription(entry.mood)}
                    </p>
                    
                    <TagGroup>
                      {entry.factors?.map((f, i) => <Tag key={i}>{f.factor}</Tag>)}
                      {entry.activities?.map((a, i) => <Tag key={i} style={{ color: 'var(--primary-color)', background: 'rgba(99, 102, 241, 0.05)' }}>{a}</Tag>)}
                    </TagGroup>
                    
                    {entry.notes && (
                      <MoodNotes>{entry.notes}</MoodNotes>
                    )}
                  </EntryContent>
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
