import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { postsApi } from '../utils/api';
import axios from 'axios';

const ProfileContainer = styled.div`
  padding: var(--spacing-lg) 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 600;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  margin: 0 0 var(--spacing-xs);
`;

const ProfileUsername = styled.div`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
`;

const ProfileBio = styled.p`
  margin: 0;
  color: var(--text-color);
`;

const ProfileStats = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
`;

const StatCard = styled(Card)`
  flex: 1;
  text-align: center;
  padding: var(--spacing-md);
`;

const StatValue = styled.div`
  font-size: var(--font-size-xlarge);
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
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

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const PostCard = styled(Card)`
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PostTitle = styled.h3`
  margin: 0 0 var(--spacing-sm);
  color: var(--text-color);
`;

const PostContent = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
`;

const PostStats = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  
  i {
    color: var(--text-secondary);
  }
`;

const PostDate = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
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

const UserProfile = () => {
  const { userId } = useParams();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await axios.get(`/api/auth/user/${userId}`);
        setUser(userResponse.data);
        
        // Fetch user's posts
        const postsResponse = await postsApi.getPostsByUser(userId);
        setPosts(postsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const getInitials = (user) => {
    if (!user) return '';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    
    return '';
  };
  
  if (loading) {
    return (
      <ProfileContainer>
        <Container>
          <LoadingState>Loading user profile...</LoadingState>
        </Container>
      </ProfileContainer>
    );
  }
  
  if (error) {
    return (
      <ProfileContainer>
        <Container>
          <ErrorState>{error}</ErrorState>
        </Container>
      </ProfileContainer>
    );
  }
  
  if (!user) {
    return (
      <ProfileContainer>
        <Container>
          <ErrorState>User not found.</ErrorState>
        </Container>
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <Container>
        <ProfileHeader>
          <ProfileAvatar>
            {getInitials(user)}
          </ProfileAvatar>
          <ProfileInfo>
            <ProfileName>{user.firstName} {user.lastName}</ProfileName>
            <ProfileUsername>@{user.username}</ProfileUsername>
            {user.bio && <ProfileBio>{user.bio}</ProfileBio>}
          </ProfileInfo>
        </ProfileHeader>
        
        <ProfileStats>
          <StatCard>
            <StatValue>{posts.length}</StatValue>
            <StatLabel>Posts</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {posts.reduce((total, post) => total + post.likes.length, 0)}
            </StatValue>
            <StatLabel>Likes Received</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {posts.reduce((total, post) => total + post.comments.length, 0)}
            </StatValue>
            <StatLabel>Comments Received</StatLabel>
          </StatCard>
        </ProfileStats>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </Tab>
        </TabsContainer>
        
        {activeTab === 'posts' && (
          <>
            {posts.length === 0 ? (
              <EmptyState>
                <h3>No posts yet</h3>
                <p>This user hasn't created any posts yet.</p>
              </EmptyState>
            ) : (
              <PostsGrid>
                {posts.map(post => (
                  <PostCard
                    key={post._id}
                    hoverable
                    clickable
                    as={Link}
                    to={`/community/${post._id}`}
                  >
                    <PostTitle>{post.title}</PostTitle>
                    <PostContent>{post.content}</PostContent>
                    <PostFooter>
                      <PostStats>
                        <StatItem>
                          <i className="fas fa-heart"></i>
                          {post.likes.length}
                        </StatItem>
                        <StatItem>
                          <i className="fas fa-comment"></i>
                          {post.comments.length}
                        </StatItem>
                      </PostStats>
                      <PostDate>{formatDate(post.createdAt)}</PostDate>
                    </PostFooter>
                  </PostCard>
                ))}
              </PostsGrid>
            )}
          </>
        )}
        
        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
          <Button 
            as={Link} 
            to="/community"
            variant="secondary"
          >
            Back to Community
          </Button>
        </div>
      </Container>
    </ProfileContainer>
  );
};

export default UserProfile;
