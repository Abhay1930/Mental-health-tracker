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
import MoodInsights from '../components/dashboard/MoodInsights';
import WellnessScore from '../components/dashboard/WellnessScore';
import MoodPrediction from '../components/dashboard/MoodPrediction';
import { useAuth } from '../context/AuthContext';
import { moodApi, exercisesApi, resourcesApi, journalApi, goalsApi } from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContainer = styled.div`
  padding: var(--spacing-lg) 0;
`;

const WelcomeSection = styled.div`
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--wellness-gradient);
  border-radius: var(--border-radius-xl);
  color: white;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    filter: blur(40px);
  }
`;

const WelcomeTitle = styled.h1`
  margin-bottom: var(--spacing-xs);
  font-size: 2.5rem;
  color: white;
`;

const WelcomeSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const MoodSummary = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const MoodStat = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  background: var(--background-color);
  border-radius: var(--border-radius-md);
  flex: 1;
  border: 1px solid var(--border-color);

  h3 {
    font-size: 0.875rem;
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  p {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    color: var(--primary-color);
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
    
    i { transform: scale(1.1); }
  }

  i {
    font-size: 2.5rem;
    background: var(--wellness-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--spacing-md);
    transition: transform var(--transition-normal);
  }

  h3 {
    color: var(--text-color);
    font-size: 1.25rem;
    margin-bottom: var(--spacing-xs);
    text-align: center;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
  }
`;

const ResourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ResourceItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  border: 1px solid transparent;

  &:hover {
    background-color: var(--background-color);
    border-color: var(--border-color);
    transform: translateX(4px);
  }

  i {
    color: var(--primary-color);
    margin-right: var(--spacing-md);
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }

  div {
    flex: 1;
  }

  h4 {
    color: var(--text-color);
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 0.85rem;
  }
`;

const ExercisesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ExerciseItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  border: 1px solid transparent;

  &:hover {
    background-color: var(--background-color);
    border-color: var(--border-color);
    transform: translateX(4px);
  }

  i {
    color: var(--primary-color);
    margin-right: var(--spacing-md);
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }

  div {
    flex: 1;
  }

  h4 {
    color: var(--text-color);
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 0.85rem;
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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [moodData, setMoodData] = useState([]);
  const [resources, setResources] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [journals, setJournals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState({
    moods: true,
    resources: true,
    exercises: true,
    journals: true,
    goals: true
  });
  const [error, setError] = useState({
    moods: null,
    resources: null,
    exercises: null,
    journals: null,
    goals: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const moodResponse = await moodApi.getMoods();
        setMoodData(moodResponse.data);
        setLoading(prev => ({ ...prev, moods: false }));
      } catch (err) {
        console.error('Error fetching mood data:', err);
        setError(prev => ({ ...prev, moods: 'Failed to load mood data' }));
        setLoading(prev => ({ ...prev, moods: false }));
      }

      try {

        const resourcesResponse = await resourcesApi.getResources();
        setResources(resourcesResponse.data.slice(0, 5)); // Get first 5 resources
        setLoading(prev => ({ ...prev, resources: false }));
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(prev => ({ ...prev, resources: 'Failed to load resources' }));
        setLoading(prev => ({ ...prev, resources: false }));
      }

      try {

        const exercisesResponse = await exercisesApi.getExercises();
        setExercises(exercisesResponse.data.slice(0, 5)); // Get first 5 exercises
        setLoading(prev => ({ ...prev, exercises: false }));
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(prev => ({ ...prev, exercises: 'Failed to load exercises' }));
        setLoading(prev => ({ ...prev, exercises: false }));
      }

      try {

        const journalResponse = await journalApi.getJournals();
        setJournals(journalResponse.data.slice(0, 5)); // Get first 5 journal entries
        setLoading(prev => ({ ...prev, journals: false }));
      } catch (err) {
        console.error('Error fetching journal entries:', err);
        setError(prev => ({ ...prev, journals: 'Failed to load journal entries' }));
        setLoading(prev => ({ ...prev, journals: false }));
      }

      try {

        const goalsResponse = await goalsApi.getGoals();
        setGoals(goalsResponse.data.filter(goal => !goal.isCompleted).slice(0, 5)); // Get first 5 incomplete goals
        setLoading(prev => ({ ...prev, goals: false }));
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError(prev => ({ ...prev, goals: 'Failed to load goals' }));
        setLoading(prev => ({ ...prev, goals: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: moodData.slice(-7).map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [
      {
        label: 'Mood Level',
        data: moodData.slice(-7).map(entry => entry.mood).reverse(),
        borderColor: 'rgb(0, 113, 227)',
        backgroundColor: 'rgba(0, 113, 227, 0.5)',
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Mood Trend (Last 7 Days)'
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

  const calculateAverageMood = () => {
    if (moodData.length === 0) return 'N/A';
    const sum = moodData.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodData.length).toFixed(1);
  };

  const getLatestMood = () => {
    if (moodData.length === 0) return 'N/A';
    return moodData[0].mood;
  };

  const getMoodTrend = () => {
    if (moodData.length < 2) return 'N/A';
    const latest = moodData[0].mood;
    const previous = moodData[1].mood;

    if (latest > previous) return 'Improving ↑';
    if (latest < previous) return 'Declining ↓';
    return 'Stable →';
  };

  return (
    <DashboardContainer>
      <Container>
        <WelcomeSection>
          <WelcomeTitle>Welcome, {currentUser?.firstName || currentUser?.username}!</WelcomeTitle>
          <WelcomeSubtitle>
            Track your mood, explore exercises, and find resources to support your mental health journey.
          </WelcomeSubtitle>
        </WelcomeSection>

        <WellnessScore />
        <MoodPrediction />

        <DashboardGrid>
          <MainColumn>
            <Card title="Mood Overview">
              {loading.moods ? (
                <LoadingState>Loading mood data...</LoadingState>
              ) : error.moods ? (
                <ErrorState>{error.moods}</ErrorState>
              ) : moodData.length === 0 ? (
                <div>
                  <p>You haven't tracked any moods yet.</p>
                  <Button
                    as={Link}
                    to="/mood-tracker"
                    variant="primary"
                    style={{ marginTop: 'var(--spacing-md)' }}
                  >
                    Start Tracking
                  </Button>
                </div>
              ) : (
                <>
                  <MoodSummary>
                    <MoodStat>
                      <h3>Latest Mood</h3>
                      <p>{getLatestMood()}/10</p>
                    </MoodStat>
                    <MoodStat>
                      <h3>Average Mood</h3>
                      <p>{calculateAverageMood()}/10</p>
                    </MoodStat>
                    <MoodStat>
                      <h3>Trend</h3>
                      <p>{getMoodTrend()}</p>
                    </MoodStat>
                  </MoodSummary>

                  <div style={{ height: '300px' }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>

                  <MoodInsights />

                  <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
                    <Button as={Link} to="/mood-tracker" variant="secondary">
                      View Full Mood History
                    </Button>
                  </div>
                </>
              )}
            </Card>

            <Card title="Quick Actions">
              <QuickActions>
                <ActionCard to="/mood-tracker/new">
                  <i className="fas fa-plus-circle"></i>
                  <h3>Track Mood</h3>
                  <p>Record how you're feeling today</p>
                </ActionCard>

                <ActionCard to="/exercises">
                  <i className="fas fa-spa"></i>
                  <h3>Exercises</h3>
                  <p>Explore mindfulness activities</p>
                </ActionCard>

                <ActionCard to="/resources">
                  <i className="fas fa-hands-helping"></i>
                  <h3>Resources</h3>
                  <p>Find professional support</p>
                </ActionCard>

                <ActionCard to="/mood-diary">
                  <i className="fas fa-book"></i>
                  <h3>Mood Diary</h3>
                  <p>Write about your feelings</p>
                </ActionCard>
              </QuickActions>
            </Card>
          </MainColumn>

          <SideColumn>
            <Card
              title="Recommended Exercises"
              footer={
                <Button as={Link} to="/exercises" variant="secondary" size="small">
                  View All
                </Button>
              }
            >
              {loading.exercises ? (
                <LoadingState>Loading exercises...</LoadingState>
              ) : error.exercises ? (
                <ErrorState>{error.exercises}</ErrorState>
              ) : exercises.length === 0 ? (
                <p>No exercises available at the moment.</p>
              ) : (
                <ExercisesList>
                  {exercises.map(exercise => (
                    <ExerciseItem key={exercise._id} to={`/exercises/${exercise._id}`}>
                      <i className={`fas fa-${
                        exercise.category === 'Meditation' ? 'spa' :
                        exercise.category === 'Breathing' ? 'wind' :
                        exercise.category === 'Physical' ? 'dumbbell' :
                        'brain'
                      }`}></i>
                      <div>
                        <h4>{exercise.title}</h4>
                        <p>{exercise.duration} min • {exercise.category}</p>
                      </div>
                    </ExerciseItem>
                  ))}
                </ExercisesList>
              )}
            </Card>

            <Card
              title="Support Resources"
              footer={
                <Button as={Link} to="/resources" variant="secondary" size="small">
                  View All
                </Button>
              }
            >
              {loading.resources ? (
                <LoadingState>Loading resources...</LoadingState>
              ) : error.resources ? (
                <ErrorState>{error.resources}</ErrorState>
              ) : resources.length === 0 ? (
                <p>No resources available at the moment.</p>
              ) : (
                <ResourcesList>
                  {resources.map(resource => (
                    <ResourceItem key={resource._id} to={`/resources/${resource._id}`}>
                      <i className={`fas fa-${
                        resource.category === 'Therapist' ? 'user-md' :
                        resource.category === 'Counselor' ? 'comments' :
                        resource.category === 'Support Group' ? 'users' :
                        resource.category === 'Hotline' ? 'phone' :
                        'link'
                      }`}></i>
                      <div>
                        <h4>{resource.title}</h4>
                        <p>{resource.category}</p>
                      </div>
                    </ResourceItem>
                  ))}
                </ResourcesList>
              )}
            </Card>
          </SideColumn>
        </DashboardGrid>
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard;
