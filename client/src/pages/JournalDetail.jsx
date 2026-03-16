import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import JournalAnalysis from '../components/journal/JournalAnalysis';
import { journalApi } from '../utils/api';

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

const JournalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
`;

const JournalDate = styled.div`
  color: var(--text-secondary);
`;

const PrivacyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => props.isPrivate ? 'rgba(76, 217, 100, 0.1)' : 'rgba(255, 204, 0, 0.1)'};
  color: ${props => props.isPrivate ? 'var(--success-color)' : 'var(--warning-color)'};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);

  i {
    margin-right: var(--spacing-xs);
  }
`;

const MoodIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);

  span {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: var(--spacing-md);
    background-color: ${props => {
      if (props.value >= 9) return '#4cd964'; // Excellent
      if (props.value >= 7) return '#5ac8fa'; // Good
      if (props.value >= 5) return '#ffcc00'; // Neutral
      if (props.value >= 3) return '#ff9500'; // Poor
      return '#ff3b30'; // Very Poor
    }};
  }

  div {
    flex: 1;
  }

  h3 {
    margin: 0 0 var(--spacing-xs);
    color: var(--text-color);
  }

  p {
    margin: 0;
    color: var(--text-secondary);
  }
`;

const JournalContent = styled.div`
  white-space: pre-line;
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
`;

const Tag = styled.div`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
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

const JournalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true);
        const response = await journalApi.getJournal(id);
        setJournal(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching journal entry:', err);
        setError('Failed to load journal entry. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await journalApi.deleteJournal(id);
      navigate('/journal');
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      setError('Failed to delete journal entry. Please try again.');
      setDeleting(false);
    }
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

  const getMoodDescription = (level) => {
    if (!level) return null;
    if (level >= 9) return 'Excellent';
    if (level >= 7) return 'Good';
    if (level >= 5) return 'Neutral';
    if (level >= 3) return 'Poor';
    return 'Very Poor';
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading journal entry...</LoadingState>
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

  if (!journal) {
    return (
      <Container>
        <ErrorState>Journal entry not found.</ErrorState>
      </Container>
    );
  }

  return (
    <DetailContainer>
      <Container>
        <PageHeader>
          <PageTitle>{journal.title}</PageTitle>
          <ButtonGroup>
            <Button
              as={Link}
              to={`/journal/${id}/edit`}
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
          </ButtonGroup>
        </PageHeader>

        <Card>
          <JournalMeta>
            <JournalDate>
              <i className="far fa-calendar"></i> {formatDate(journal.createdAt)}
              {journal.updatedAt !== journal.createdAt && (
                <span> (Edited: {formatDate(journal.updatedAt)})</span>
              )}
            </JournalDate>
            <PrivacyBadge isPrivate={journal.isPrivate}>
              <i className={`fas fa-${journal.isPrivate ? 'lock' : 'unlock'}`}></i>
              {journal.isPrivate ? 'Private Entry' : 'Shared Entry'}
            </PrivacyBadge>
          </JournalMeta>

          {journal.mood && (
            <MoodIndicator value={journal.mood}>
              <span></span>
              <div>
                <h3>Mood: {getMoodDescription(journal.mood)}</h3>
                <p>Rated {journal.mood}/10</p>
              </div>
            </MoodIndicator>
          )}

          <JournalContent>
            {journal.content}
          </JournalContent>

          <JournalAnalysis content={journal.content} />

          {journal.tags && journal.tags.length > 0 && (
            <>
              <h3>Tags</h3>
              <TagsContainer>
                {journal.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsContainer>
            </>
          )}

          {showDeleteConfirmation && (
            <DeleteConfirmation>
              <ConfirmationTitle>Are you sure you want to delete this journal entry?</ConfirmationTitle>
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
        </Card>

        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
          <Button
            as={Link}
            to="/journal"
            variant="secondary"
          >
            Back to Journal
          </Button>
        </div>
      </Container>
    </DetailContainer>
  );
};

export default JournalDetail;
