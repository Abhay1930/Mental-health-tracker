import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { postsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CommunityContainer = styled.div`
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

const SearchContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SearchInput = styled.input`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  width: 100%;
  font-size: var(--font-size-medium);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
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

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const PostAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.div`
  font-weight: 600;
  color: var(--text-color);
`;

const PostDate = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
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
    color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
`;

const Tag = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  cursor: pointer;
  
  &:hover {
    background-color: var(--border-color);
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

const Community = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getPosts();
        setPosts(response.data);
        setFilteredPosts(response.data);
        
        // Extract unique tags from all posts
        const allTags = response.data.reduce((acc, post) => {
          if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []);
        
        setTags(allTags);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load community posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  useEffect(() => {
    // Filter posts based on active tag and search query
    let filtered = posts;
    
    // Filter by tag
    if (activeTag !== 'All') {
      filtered = filtered.filter(post => 
        post.tags && post.tags.includes(activeTag)
      );
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(filtered);
  }, [activeTag, searchQuery, posts]);
  
  const handleTagChange = (tag) => {
    setActiveTag(tag);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };
  
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
      <CommunityContainer>
        <Container>
          <PageHeader>
            <PageTitle>Community</PageTitle>
            <Button as={Link} to="/community/new">
              <i className="fas fa-plus"></i> New Post
            </Button>
          </PageHeader>
          <LoadingState>Loading community posts...</LoadingState>
        </Container>
      </CommunityContainer>
    );
  }
  
  if (error) {
    return (
      <CommunityContainer>
        <Container>
          <PageHeader>
            <PageTitle>Community</PageTitle>
            <Button as={Link} to="/community/new">
              <i className="fas fa-plus"></i> New Post
            </Button>
          </PageHeader>
          <ErrorState>{error}</ErrorState>
        </Container>
      </CommunityContainer>
    );
  }
  
  return (
    <CommunityContainer>
      <Container>
        <PageHeader>
          <PageTitle>Community</PageTitle>
          <Button as={Link} to="/community/new">
            <i className="fas fa-plus"></i> New Post
          </Button>
        </PageHeader>
        
        <SearchContainer>
          <SearchInput 
            type="text"
            placeholder="Search community posts..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        
        <FiltersContainer>
          <FilterButton
            active={activeTag === 'All'}
            onClick={() => handleTagChange('All')}
          >
            All Posts
          </FilterButton>
          {tags.map(tag => (
            <FilterButton
              key={tag}
              active={activeTag === tag}
              onClick={() => handleTagChange(tag)}
            >
              {tag}
            </FilterButton>
          ))}
        </FiltersContainer>
        
        {filteredPosts.length === 0 ? (
          <EmptyState>
            <h3>No posts found</h3>
            <p>
              {posts.length === 0
                ? 'Be the first to share your thoughts with the community!'
                : 'No posts match your current filters. Try adjusting your search or filters.'}
            </p>
            <Button as={Link} to="/community/new">
              Create Your First Post
            </Button>
          </EmptyState>
        ) : (
          <PostsGrid>
            {filteredPosts.map(post => (
              <PostCard
                key={post._id}
                hoverable
                clickable
                as={Link}
                to={`/community/${post._id}`}
              >
                <PostHeader>
                  <PostAuthor>
                    <AuthorAvatar>
                      {getInitials(post.user)}
                    </AuthorAvatar>
                    <AuthorInfo>
                      <AuthorName>
                        {post.user?.firstName && post.user?.lastName
                          ? `${post.user.firstName} ${post.user.lastName}`
                          : post.user?.username || 'Anonymous'}
                      </AuthorName>
                      <PostDate>{formatDate(post.createdAt)}</PostDate>
                    </AuthorInfo>
                  </PostAuthor>
                </PostHeader>
                
                <PostTitle>{post.title}</PostTitle>
                <PostContent>{post.content}</PostContent>
                
                {post.tags && post.tags.length > 0 && (
                  <TagsContainer>
                    {post.tags.map((tag, index) => (
                      <Tag 
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTagClick(tag);
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </TagsContainer>
                )}
                
                <PostFooter>
                  <PostStats>
                    <StatItem active={post.likes.includes(currentUser?._id)}>
                      <i className="fas fa-heart"></i>
                      {post.likes.length}
                    </StatItem>
                    <StatItem>
                      <i className="fas fa-comment"></i>
                      {post.comments.length}
                    </StatItem>
                  </PostStats>
                </PostFooter>
              </PostCard>
            ))}
          </PostsGrid>
        )}
      </Container>
    </CommunityContainer>
  );
};

export default Community;
