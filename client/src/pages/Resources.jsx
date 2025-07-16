import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import ResourceRecommendations from '../components/resources/ResourceRecommendations';
import { resourcesApi } from '../utils/api';

const ResourcesContainer = styled.div`
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

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const ResourceCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal);

  &:hover {
    transform: translateY(-5px);
  }
`;

const ResourceCategory = styled.div`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-sm);
`;

const ResourceDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
`;

const ContactInfo = styled.div`
  margin-top: auto;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);

  i {
    color: var(--primary-color);
    margin-right: var(--spacing-sm);
    width: 16px;
  }

  a {
    color: var(--text-color);
    text-decoration: none;

    &:hover {
      color: var(--primary-color);
    }
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

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available categories
  const categories = [
    'All',
    'Therapist',
    'Counselor',
    'Psychiatrist',
    'Support Group',
    'Hotline',
    'Online Platform',
    'Other'
  ];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await resourcesApi.getResources();
        setResources(response.data);
        setFilteredResources(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.category === activeCategory));
    }
  }, [activeCategory, resources]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  if (loading) {
    return (
      <ResourcesContainer>
        <Container>
          <PageHeader>
            <PageTitle>Professional Resources</PageTitle>
            <PageDescription>
              Find professional help and support for your mental health journey.
            </PageDescription>
          </PageHeader>
          <LoadingState>Loading resources...</LoadingState>
        </Container>
      </ResourcesContainer>
    );
  }

  if (error) {
    return (
      <ResourcesContainer>
        <Container>
          <PageHeader>
            <PageTitle>Professional Resources</PageTitle>
            <PageDescription>
              Find professional help and support for your mental health journey.
            </PageDescription>
          </PageHeader>
          <ErrorState>{error}</ErrorState>
        </Container>
      </ResourcesContainer>
    );
  }

  return (
    <ResourcesContainer>
      <Container>
        <PageHeader>
          <PageTitle>Professional Resources</PageTitle>
          <PageDescription>
            Find professional help and support for your mental health journey.
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

        {filteredResources.length === 0 ? (
          <EmptyState>
            <h3>No resources found</h3>
            <p>
              {activeCategory === 'All'
                ? 'There are no resources available at the moment.'
                : `There are no ${activeCategory} resources available at the moment.`}
            </p>
            {activeCategory !== 'All' && (
              <Button onClick={() => setActiveCategory('All')}>
                View All Resources
              </Button>
            )}
          </EmptyState>
        ) : (
          <ResourcesGrid>
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource._id}
                title={resource.title}
                hoverable
                clickable
                as={Link}
                to={`/resources/${resource._id}`}
              >
                <ResourceCategory>{resource.category}</ResourceCategory>
                <ResourceDescription>
                  {resource.description.length > 150
                    ? `${resource.description.substring(0, 150)}...`
                    : resource.description}
                </ResourceDescription>

                <ContactInfo>
                  {resource.contactInfo?.phone && (
                    <ContactItem>
                      <i className="fas fa-phone"></i>
                      <a href={`tel:${resource.contactInfo.phone}`}>
                        {resource.contactInfo.phone}
                      </a>
                    </ContactItem>
                  )}

                  {resource.contactInfo?.email && (
                    <ContactItem>
                      <i className="fas fa-envelope"></i>
                      <a href={`mailto:${resource.contactInfo.email}`}>
                        {resource.contactInfo.email}
                      </a>
                    </ContactItem>
                  )}

                  {resource.contactInfo?.website && (
                    <ContactItem>
                      <i className="fas fa-globe"></i>
                      <a href={resource.contactInfo.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </ContactItem>
                  )}

                  {resource.contactInfo?.address && (
                    <ContactItem>
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{resource.contactInfo.address}</span>
                    </ContactItem>
                  )}
                </ContactInfo>
              </ResourceCard>
            ))}
          </ResourcesGrid>
        )}

        <ResourceRecommendations />
      </Container>
    </ResourcesContainer>
  );
};

export default Resources;
