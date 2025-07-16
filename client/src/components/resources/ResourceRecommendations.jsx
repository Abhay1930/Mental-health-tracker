import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../common/Card';
import { moodApi, resourcesApi } from '../../utils/api';

const RecommendationsContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

const RecommendationsTitle = styled.h3`
  margin-bottom: var(--spacing-md);
`;

const RecommendationsDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
`;

const RecommendationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
`;

const RecommendationCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ResourceCategory = styled.div`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => {
    switch (props.category) {
      case 'Hotline': return 'rgba(255, 59, 48, 0.1)';
      case 'Online Platform': return 'rgba(0, 122, 255, 0.1)';
      case 'Therapist': return 'rgba(88, 86, 214, 0.1)';
      case 'Support Group': return 'rgba(52, 199, 89, 0.1)';
      default: return 'rgba(142, 142, 147, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'Hotline': return 'var(--error-color)';
      case 'Online Platform': return 'var(--primary-color)';
      case 'Therapist': return '#5856D6';
      case 'Support Group': return 'var(--success-color)';
      default: return 'var(--text-secondary)';
    }
  }};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-sm);
`;

const ResourceTitle = styled.h3`
  margin: 0 0 var(--spacing-sm);
  color: var(--text-color);
`;

const ResourceDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
`;

const ResourceContact = styled.div`
  margin-top: auto;
  font-size: var(--font-size-small);
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RecommendationReason = styled.div`
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  border-left: 3px solid var(--primary-color);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg);
  color: var(--text-secondary);
`;

const ResourceRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to get personalized recommendations
        // For now, we'll simulate with mock data
        
        // Fetch all resources
        const resourcesResponse = await resourcesApi.getResources();
        const allResources = resourcesResponse.data;
        
        // Fetch recent mood entries
        const moodResponse = await moodApi.getMoods();
        const recentMoods = moodResponse.data.slice(0, 5);
        
        // Calculate average mood
        const avgMood = recentMoods.length > 0
          ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length
          : null;
        
        // Generate recommendations based on mood
        let recommendedResources = [];
        
        if (avgMood !== null) {
          // Low mood - prioritize hotlines and support groups
          if (avgMood < 4) {
            const hotlines = allResources.filter(resource => resource.category === 'Hotline');
            const supportGroups = allResources.filter(resource => resource.category === 'Support Group');
            
            recommendedResources = [
              ...hotlines.slice(0, 2),
              ...supportGroups.slice(0, 2)
            ];
            
            // Add reasons
            recommendedResources = recommendedResources.map(resource => ({
              ...resource,
              reason: resource.category === 'Hotline'
                ? 'Based on your recent mood entries, immediate support might be helpful'
                : 'Connecting with others who understand can help improve your mood'
            }));
          }
          // Medium mood - prioritize therapists and online platforms
          else if (avgMood < 7) {
            const therapists = allResources.filter(resource => resource.category === 'Therapist');
            const platforms = allResources.filter(resource => resource.category === 'Online Platform');
            
            recommendedResources = [
              ...therapists.slice(0, 2),
              ...platforms.slice(0, 2)
            ];
            
            // Add reasons
            recommendedResources = recommendedResources.map(resource => ({
              ...resource,
              reason: resource.category === 'Therapist'
                ? 'Professional support can help maintain and improve your mental wellbeing'
                : 'Online resources can provide ongoing support for your mental health journey'
            }));
          }
          // High mood - provide a mix of resources for maintenance
          else {
            // Get a mix of resources
            recommendedResources = allResources
              .sort(() => 0.5 - Math.random())
              .slice(0, 4);
            
            // Add reasons
            recommendedResources = recommendedResources.map(resource => ({
              ...resource,
              reason: 'Resources to help maintain your positive mental state'
            }));
          }
        } else {
          // No mood data - provide a random selection
          recommendedResources = allResources
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          
          // Add reasons
          recommendedResources = recommendedResources.map(resource => ({
            ...resource,
            reason: 'Recommended resources to support your mental health'
          }));
        }
        
        setRecommendations(recommendedResources);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);
  
  if (loading) {
    return (
      <RecommendationsContainer>
        <RecommendationsTitle>Personalized Recommendations</RecommendationsTitle>
        <LoadingState>Generating recommendations for you...</LoadingState>
      </RecommendationsContainer>
    );
  }
  
  if (error) {
    return (
      <RecommendationsContainer>
        <RecommendationsTitle>Personalized Recommendations</RecommendationsTitle>
        <div style={{ color: 'var(--error-color)' }}>{error}</div>
      </RecommendationsContainer>
    );
  }
  
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <RecommendationsContainer>
      <RecommendationsTitle>Personalized Recommendations</RecommendationsTitle>
      <RecommendationsDescription>
        Based on your recent activity and mood patterns, these resources might be helpful for you.
      </RecommendationsDescription>
      
      <RecommendationsList>
        {recommendations.map(resource => (
          <RecommendationCard
            key={resource._id}
            hoverable
            clickable
            as={Link}
            to={`/resources/${resource._id}`}
          >
            <ResourceCategory category={resource.category}>
              {resource.category}
            </ResourceCategory>
            <ResourceTitle>{resource.title}</ResourceTitle>
            <ResourceDescription>
              {resource.description.length > 150
                ? `${resource.description.substring(0, 150)}...`
                : resource.description}
            </ResourceDescription>
            
            <ResourceContact>
              {resource.contactInfo?.phone && (
                <div>
                  <i className="fas fa-phone"></i> {resource.contactInfo.phone}
                </div>
              )}
              {resource.contactInfo?.website && (
                <div>
                  <i className="fas fa-globe"></i>{' '}
                  <a 
                    href={resource.contactInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </ResourceContact>
            
            <RecommendationReason>
              <i className="fas fa-lightbulb" style={{ marginRight: 'var(--spacing-xs)' }}></i>
              {resource.reason}
            </RecommendationReason>
          </RecommendationCard>
        ))}
      </RecommendationsList>
    </RecommendationsContainer>
  );
};

export default ResourceRecommendations;
