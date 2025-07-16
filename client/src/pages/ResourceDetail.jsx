import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { resourcesApi } from '../utils/api';

const DetailContainer = styled.div`
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

const ResourceCategory = styled.div`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-md);
`;

const DetailSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
`;

const Description = styled.div`
  white-space: pre-line;
  margin-bottom: var(--spacing-lg);
`;

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ContactCard = styled.div`
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  i {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
  }
  
  h4 {
    margin-bottom: var(--spacing-xs);
  }
  
  a {
    color: var(--text-color);
    text-decoration: none;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => props.verified ? 'rgba(76, 217, 100, 0.1)' : 'rgba(255, 204, 0, 0.1)'};
  color: ${props => props.verified ? 'var(--success-color)' : 'var(--warning-color)'};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-md);
  
  i {
    margin-right: var(--spacing-xs);
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

const ResourceDetail = () => {
  const { id } = useParams();
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await resourcesApi.getResource(id);
        setResource(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError('Failed to load resource. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);
  
  if (loading) {
    return (
      <Container>
        <LoadingState>Loading resource...</LoadingState>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ErrorState>{error}</ErrorState>
      </Container>
    );
  }
  
  if (!resource) {
    return (
      <Container>
        <ErrorState>Resource not found.</ErrorState>
      </Container>
    );
  }
  
  return (
    <DetailContainer>
      <Container>
        <PageHeader>
          <PageTitle>{resource.title}</PageTitle>
        </PageHeader>
        
        <Card>
          <ResourceCategory>{resource.category}</ResourceCategory>
          
          <VerificationBadge verified={resource.isVerified}>
            <i className={`fas fa-${resource.isVerified ? 'check-circle' : 'exclamation-triangle'}`}></i>
            {resource.isVerified ? 'Verified Resource' : 'Unverified Resource'}
          </VerificationBadge>
          
          <DetailSection>
            <SectionTitle>Description</SectionTitle>
            <Description>{resource.description}</Description>
          </DetailSection>
          
          <DetailSection>
            <SectionTitle>Contact Information</SectionTitle>
            <ContactInfo>
              {resource.contactInfo?.phone && (
                <ContactCard>
                  <i className="fas fa-phone"></i>
                  <h4>Phone</h4>
                  <a href={`tel:${resource.contactInfo.phone}`}>
                    {resource.contactInfo.phone}
                  </a>
                </ContactCard>
              )}
              
              {resource.contactInfo?.email && (
                <ContactCard>
                  <i className="fas fa-envelope"></i>
                  <h4>Email</h4>
                  <a href={`mailto:${resource.contactInfo.email}`}>
                    {resource.contactInfo.email}
                  </a>
                </ContactCard>
              )}
              
              {resource.contactInfo?.website && (
                <ContactCard>
                  <i className="fas fa-globe"></i>
                  <h4>Website</h4>
                  <a href={resource.contactInfo.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </ContactCard>
              )}
              
              {resource.contactInfo?.address && (
                <ContactCard>
                  <i className="fas fa-map-marker-alt"></i>
                  <h4>Address</h4>
                  <p>{resource.contactInfo.address}</p>
                </ContactCard>
              )}
            </ContactInfo>
          </DetailSection>
        </Card>
        
        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
          <Button 
            as={Link} 
            to="/resources"
            variant="secondary"
          >
            Back to Resources
          </Button>
        </div>
      </Container>
    </DetailContainer>
  );
};

export default ResourceDetail;
