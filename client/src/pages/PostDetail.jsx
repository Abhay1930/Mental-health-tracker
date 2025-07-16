import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Container from '../components/common/Container';
import { postsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
`;

const PostAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.div`
  font-weight: 600;
  color: var(--text-color);
  font-size: var(--font-size-medium);
`;

const PostDate = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const PostContent = styled.div`
  white-space: pre-line;
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
`;

const Tag = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
`;

const PostActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--background-color);
  }
  
  i {
    font-size: 1.2rem;
  }
`;

const CommentsSection = styled.div`
  margin-top: var(--spacing-xl);
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const CommentCard = styled.div`
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const CommentAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
`;

const CommentInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentName = styled.div`
  font-weight: 600;
  color: var(--text-color);
  font-size: var(--font-size-small);
`;

const CommentDate = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const CommentContent = styled.p`
  margin: 0;
  color: var(--text-color);
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
`;

const CommentButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: var(--font-size-small);
  padding: var(--spacing-xs);
  
  &:hover {
    color: ${props => props.danger ? 'var(--error-color)' : 'var(--primary-color)'};
  }
`;

const DeleteConfirmation = styled.div`
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  border: 1px solid var(--error-color);
  border-radius: var(--border-radius-md);
  background-color: rgba(255, 59, 48, 0.05);
`;

const ConfirmationTitle = styled.h4`
  color: var(--error-color);
  margin-bottom: var(--spacing-sm);
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const ReportConfirmation = styled.div`
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--warning-color);
  border-radius: var(--border-radius-md);
  background-color: rgba(255, 204, 0, 0.05);
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

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showReportConfirmation, setShowReportConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [liking, setLiking] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getPost(id);
        setPost(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await postsApi.deletePost(id);
      navigate('/community');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
      setDeleting(false);
    }
  };
  
  const handleReport = async () => {
    try {
      setReporting(true);
      await postsApi.reportPost(id);
      setShowReportConfirmation(false);
      setError(null);
      // Show success message or update UI
      alert('Post reported successfully. Our moderators will review it.');
    } catch (err) {
      console.error('Error reporting post:', err);
      setError('Failed to report post. Please try again.');
    } finally {
      setReporting(false);
    }
  };
  
  const handleLike = async () => {
    if (liking) return;
    
    try {
      setLiking(true);
      const response = await postsApi.likePost(id);
      
      // Update the post with the new likes array
      setPost({
        ...post,
        likes: response.data
      });
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post. Please try again.');
    } finally {
      setLiking(false);
    }
  };
  
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await postsApi.addComment(id, { text: comment });
      
      // Update the post with the new comments
      setPost({
        ...post,
        comments: response.data
      });
      
      // Clear the comment input
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await postsApi.deleteComment(id, commentId);
      
      // Update the post with the new comments
      setPost({
        ...post,
        comments: response.data
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
    }
  };
  
  const handleReportComment = async (commentId) => {
    try {
      await postsApi.reportComment(id, commentId);
      alert('Comment reported successfully. Our moderators will review it.');
    } catch (err) {
      console.error('Error reporting comment:', err);
      setError('Failed to report comment. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <Container>
        <LoadingState>Loading post...</LoadingState>
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
  
  if (!post) {
    return (
      <Container>
        <ErrorState>Post not found.</ErrorState>
      </Container>
    );
  }
  
  const isAuthor = currentUser && post.user && post.user._id === currentUser._id;
  const hasLiked = post.likes.includes(currentUser?._id);
  
  return (
    <DetailContainer>
      <Container>
        <PageHeader>
          <PageTitle>{post.title}</PageTitle>
          <ButtonGroup>
            {isAuthor && (
              <>
                <Button 
                  as={Link} 
                  to={`/community/${id}/edit`}
                  variant="secondary"
                >
                  <i className="fas fa-edit"></i> Edit
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  <i className="fas fa-trash"></i> Delete
                </Button>
              </>
            )}
            {!isAuthor && (
              <Button 
                variant="warning"
                onClick={() => setShowReportConfirmation(true)}
              >
                <i className="fas fa-flag"></i> Report
              </Button>
            )}
          </ButtonGroup>
        </PageHeader>
        
        <Card>
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
          
          <PostContent>{post.content}</PostContent>
          
          {post.tags && post.tags.length > 0 && (
            <TagsContainer>
              {post.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
          )}
          
          <PostActions>
            <ActionButton 
              onClick={handleLike}
              active={hasLiked}
              disabled={liking}
            >
              <i className={`${hasLiked ? 'fas' : 'far'} fa-heart`}></i>
              {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
            </ActionButton>
            <ActionButton
              onClick={() => document.getElementById('comment-input').focus()}
            >
              <i className="far fa-comment"></i>
              {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
            </ActionButton>
          </PostActions>
          
          <CommentsSection>
            <h3>Comments</h3>
            
            <CommentForm onSubmit={handleCommentSubmit}>
              <Input
                id="comment-input"
                as="textarea"
                rows="3"
                placeholder="Write a comment..."
                value={comment}
                onChange={handleCommentChange}
                required
              />
              <Button 
                type="submit"
                disabled={submitting || !comment.trim()}
                style={{ alignSelf: 'flex-end' }}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </CommentForm>
            
            {post.comments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <CommentsList>
                {post.comments.map(comment => (
                  <CommentCard key={comment._id}>
                    <CommentHeader>
                      <CommentAuthor>
                        <CommentAvatar>
                          {getInitials(comment.user)}
                        </CommentAvatar>
                        <CommentInfo>
                          <CommentName>
                            {comment.user?.firstName && comment.user?.lastName
                              ? `${comment.user.firstName} ${comment.user.lastName}`
                              : comment.user?.username || 'Anonymous'}
                          </CommentName>
                          <CommentDate>{formatDate(comment.date)}</CommentDate>
                        </CommentInfo>
                      </CommentAuthor>
                    </CommentHeader>
                    
                    <CommentContent>{comment.text}</CommentContent>
                    
                    <CommentActions>
                      {(currentUser?._id === comment.user?._id || isAuthor) && (
                        <CommentButton 
                          danger
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </CommentButton>
                      )}
                      {currentUser && currentUser._id !== comment.user?._id && (
                        <CommentButton onClick={() => handleReportComment(comment._id)}>
                          Report
                        </CommentButton>
                      )}
                    </CommentActions>
                  </CommentCard>
                ))}
              </CommentsList>
            )}
          </CommentsSection>
          
          {showDeleteConfirmation && (
            <DeleteConfirmation>
              <ConfirmationTitle>Are you sure you want to delete this post?</ConfirmationTitle>
              <p>This action cannot be undone.</p>
              <ConfirmationButtons>
                <Button 
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
              </ConfirmationButtons>
            </DeleteConfirmation>
          )}
          
          {showReportConfirmation && (
            <ReportConfirmation>
              <ConfirmationTitle>Report this post?</ConfirmationTitle>
              <p>If you believe this post violates our community guidelines, you can report it for review by our moderators.</p>
              <ConfirmationButtons>
                <Button 
                  variant="warning"
                  onClick={handleReport}
                  disabled={reporting}
                >
                  {reporting ? 'Reporting...' : 'Yes, Report'}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowReportConfirmation(false)}
                  disabled={reporting}
                >
                  Cancel
                </Button>
              </ConfirmationButtons>
            </ReportConfirmation>
          )}
        </Card>
        
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
    </DetailContainer>
  );
};

export default PostDetail;
