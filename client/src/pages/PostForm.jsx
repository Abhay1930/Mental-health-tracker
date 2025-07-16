import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Container from '../components/common/Container';
import { postsApi } from '../utils/api';

const FormContainer = styled.div`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormSection = styled.div`
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h3`
  margin-bottom: var(--spacing-sm);
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const TagInput = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  input {
    flex: 1;
  }
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.selected ? 'white' : 'var(--text-color)'};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
  
  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    margin-left: var(--spacing-xs);
    padding: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--error-color);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
`;

const CommunityGuidelines = styled.div`
  background-color: rgba(0, 113, 227, 0.1);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
  
  h4 {
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
  }
  
  ul {
    margin: 0;
    padding-left: var(--spacing-lg);
    
    li {
      margin-bottom: var(--spacing-xs);
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  // Common tags suggestions
  const commonTags = [
    'Anxiety', 'Depression', 'Stress', 'Self-care', 'Motivation', 
    'Mindfulness', 'Recovery', 'Support', 'Question', 'Success Story'
  ];
  
  useEffect(() => {
    // If in edit mode, fetch the post
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          setInitialLoading(true);
          const response = await postsApi.getPost(id);
          
          setFormData({
            title: response.data.title || '',
            content: response.data.content || '',
            tags: response.data.tags || []
          });
          
          setError(null);
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to load post. Please try again.');
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isEditMode]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };
  
  const handleTagInputChange = (e) => {
    setNewTag(e.target.value);
  };
  
  const addTag = () => {
    if (newTag.trim() === '') return;
    
    if (!formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
    }
    
    setNewTag('');
  };
  
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const toggleCommonTag = (tag) => {
    if (formData.tags.includes(tag)) {
      // Remove tag
      removeTag(tag);
    } else {
      // Add tag
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };
  
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditMode) {
        await postsApi.updatePost(id, formData);
      } else {
        await postsApi.createPost(formData);
      }
      
      navigate('/community');
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <Container>
        <LoadingState>Loading post...</LoadingState>
      </Container>
    );
  }
  
  return (
    <FormContainer>
      <Container>
        <PageHeader>
          <PageTitle>{isEditMode ? 'Edit Post' : 'Create New Post'}</PageTitle>
          <PageDescription>
            Share your thoughts, experiences, or questions with the community.
          </PageDescription>
        </PageHeader>
        
        <Card>
          <CommunityGuidelines>
            <h4>Community Guidelines</h4>
            <ul>
              <li>Be respectful and supportive of other community members.</li>
              <li>Do not share personal identifying information.</li>
              <li>This is not a substitute for professional help. If you're in crisis, please seek professional support.</li>
              <li>Posts that violate our guidelines may be removed.</li>
            </ul>
          </CommunityGuidelines>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleSubmit}>
            <Input
              id="title"
              name="title"
              label="Post Title"
              placeholder="Give your post a clear, descriptive title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            
            <FormSection>
              <SectionTitle>Content</SectionTitle>
              <SectionDescription>
                Share your thoughts, experiences, or questions with the community.
              </SectionDescription>
              
              <Input
                as="textarea"
                id="content"
                name="content"
                rows="10"
                placeholder="Write your post here..."
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>Tags</SectionTitle>
              <SectionDescription>
                Add tags to help others find your post.
              </SectionDescription>
              
              <TagInput>
                <Input
                  id="newTag"
                  placeholder="Add a tag (press Enter)"
                  value={newTag}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagKeyPress}
                />
                <Button 
                  type="button"
                  onClick={addTag}
                  variant="secondary"
                >
                  Add
                </Button>
              </TagInput>
              
              <SectionTitle>Common Tags</SectionTitle>
              <TagsContainer>
                {commonTags.map(tag => (
                  <Tag 
                    key={tag}
                    selected={formData.tags.includes(tag)}
                    onClick={() => toggleCommonTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </TagsContainer>
              
              {formData.tags.length > 0 && (
                <>
                  <SectionTitle>Your Tags</SectionTitle>
                  <TagsContainer>
                    {formData.tags.map(tag => (
                      <Tag key={tag} selected>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </Tag>
                    ))}
                  </TagsContainer>
                </>
              )}
            </FormSection>
            
            <ButtonGroup>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/community')}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Form>
        </Card>
      </Container>
    </FormContainer>
  );
};

export default PostForm;
