import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { postsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ModerationContainer = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-lg);
`;

const Tab = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ReportedItemsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const ReportedItem = styled(Card)`
  border-left: 4px solid var(--warning-color);
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const ItemTitle = styled.h3`
  margin: 0 0 var(--spacing-xs);
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-small);
`;

const ItemContent = styled.div`
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  border-left: 2px solid var(--border-color);
`;

const ItemActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
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

const CommunityModeration = () => {
  const { currentUser } = useAuth();
  const [reportedPosts, setReportedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check if user is admin
    if (!currentUser || !currentUser.isAdmin) {
      setError('You do not have permission to access this page.');
      setLoading(false);
      return;
    }
    
    const fetchReportedItems = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'posts') {
          const response = await postsApi.getReportedPosts();
          setReportedPosts(response.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching reported items:', err);
        setError('Failed to load reported items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportedItems();
  }, [currentUser, activeTab]);
  
  const handleApprove = async (id) => {
    try {
      await postsApi.moderatePost(id, { isApproved: true });
      
      // Remove the post from the list
      setReportedPosts(reportedPosts.filter(post => post._id !== id));
    } catch (err) {
      console.error('Error approving post:', err);
      setError('Failed to approve post. Please try again.');
    }
  };
  
  const handleReject = async (id) => {
    try {
      await postsApi.moderatePost(id, { isApproved: false });
      
      // Remove the post from the list
      setReportedPosts(reportedPosts.filter(post => post._id !== id));
    } catch (err) {
      console.error('Error rejecting post:', err);
      setError('Failed to reject post. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <ModerationContainer>
        <Container>
          <PageHeader>
            <PageTitle>Community Moderation</PageTitle>
            <PageDescription>
              Review and moderate reported content from the community.
            </PageDescription>
          </PageHeader>
          <LoadingState>Loading reported items...</LoadingState>
        </Container>
      </ModerationContainer>
    );
  }
  
  if (error) {
    return (
      <ModerationContainer>
        <Container>
          <PageHeader>
            <PageTitle>Community Moderation</PageTitle>
            <PageDescription>
              Review and moderate reported content from the community.
            </PageDescription>
          </PageHeader>
          <ErrorState>{error}</ErrorState>
        </Container>
      </ModerationContainer>
    );
  }
  
  return (
    <ModerationContainer>
      <Container>
        <PageHeader>
          <PageTitle>Community Moderation</PageTitle>
          <PageDescription>
            Review and moderate reported content from the community.
          </PageDescription>
        </PageHeader>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          >
            Reported Posts
          </Tab>
          <Tab 
            active={activeTab === 'comments'}
            onClick={() => setActiveTab('comments')}
          >
            Reported Comments
          </Tab>
        </TabsContainer>
        
        {activeTab === 'posts' && (
          <>
            {reportedPosts.length === 0 ? (
              <EmptyState>
                <h3>No reported posts</h3>
                <p>There are no posts that have been reported by users.</p>
              </EmptyState>
            ) : (
              <ReportedItemsGrid>
                {reportedPosts.map(post => (
                  <ReportedItem key={post._id}>
                    <ItemHeader>
                      <div>
                        <ItemTitle>{post.title}</ItemTitle>
                        <ItemMeta>
                          <span>By: {post.user?.firstName} {post.user?.lastName}</span>
                          <span>Posted: {formatDate(post.createdAt)}</span>
                          <span>Reported: {formatDate(post.updatedAt)}</span>
                        </ItemMeta>
                      </div>
                    </ItemHeader>
                    
                    <ItemContent>
                      {post.content.length > 300
                        ? `${post.content.substring(0, 300)}...`
                        : post.content}
                    </ItemContent>
                    
                    <ItemActions>
                      <Button 
                        as={Link} 
                        to={`/community/${post._id}`}
                        variant="secondary"
                      >
                        View Full Post
                      </Button>
                      <Button 
                        onClick={() => handleApprove(post._id)}
                        variant="success"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleReject(post._id)}
                        variant="danger"
                      >
                        Reject
                      </Button>
                    </ItemActions>
                  </ReportedItem>
                ))}
              </ReportedItemsGrid>
            )}
          </>
        )}
        
        {activeTab === 'comments' && (
          <EmptyState>
            <h3>No reported comments</h3>
            <p>There are no comments that have been reported by users.</p>
          </EmptyState>
        )}
      </Container>
    </ModerationContainer>
  );
};

export default CommunityModeration;
