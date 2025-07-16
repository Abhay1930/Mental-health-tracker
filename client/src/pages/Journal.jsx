import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { journalApi } from '../utils/api';

const JournalContainer = styled.div`
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

const JournalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const JournalCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const JournalDate = styled.div`
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-sm);
`;

const JournalTitle = styled.h3`
  margin: 0 0 var(--spacing-sm);
  color: var(--text-color);
`;

const JournalContent = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: auto;
`;

const Tag = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-small);
`;

const MoodIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  
  span {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: var(--spacing-xs);
    background-color: ${props => {
      if (props.value >= 9) return '#4cd964'; // Excellent
      if (props.value >= 7) return '#5ac8fa'; // Good
      if (props.value >= 5) return '#ffcc00'; // Neutral
      if (props.value >= 3) return '#ff9500'; // Poor
      return '#ff3b30'; // Very Poor
    }};
  }
  
  p {
    margin: 0;
    font-size: var(--font-size-small);
    color: var(--text-secondary);
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

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const response = await journalApi.getJournals();
        setJournals(response.data);
        setFilteredJournals(response.data);
        
        // Extract unique tags from all journal entries
        const allTags = response.data.reduce((acc, journal) => {
          if (journal.tags && journal.tags.length > 0) {
            journal.tags.forEach(tag => {
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
        console.error('Error fetching journals:', err);
        setError('Failed to load journal entries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournals();
  }, []);
  
  useEffect(() => {
    // Filter journals based on active tag and search query
    let filtered = journals;
    
    // Filter by tag
    if (activeTag !== 'All') {
      filtered = filtered.filter(journal => 
        journal.tags && journal.tags.includes(activeTag)
      );
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(journal => 
        journal.title.toLowerCase().includes(query) || 
        journal.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredJournals(filtered);
  }, [activeTag, searchQuery, journals]);
  
  const handleTagChange = (tag) => {
    setActiveTag(tag);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
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
      <JournalContainer>
        <Container>
          <PageHeader>
            <PageTitle>Journal</PageTitle>
            <Button as={Link} to="/journal/new">
              <i className="fas fa-plus"></i> New Entry
            </Button>
          </PageHeader>
          <LoadingState>Loading journal entries...</LoadingState>
        </Container>
      </JournalContainer>
    );
  }
  
  if (error) {
    return (
      <JournalContainer>
        <Container>
          <PageHeader>
            <PageTitle>Journal</PageTitle>
            <Button as={Link} to="/journal/new">
              <i className="fas fa-plus"></i> New Entry
            </Button>
          </PageHeader>
          <ErrorState>{error}</ErrorState>
        </Container>
      </JournalContainer>
    );
  }
  
  return (
    <JournalContainer>
      <Container>
        <PageHeader>
          <PageTitle>Journal</PageTitle>
          <Button as={Link} to="/journal/new">
            <i className="fas fa-plus"></i> New Entry
          </Button>
        </PageHeader>
        
        <SearchContainer>
          <SearchInput 
            type="text"
            placeholder="Search journal entries..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        
        <FiltersContainer>
          <FilterButton
            active={activeTag === 'All'}
            onClick={() => handleTagChange('All')}
          >
            All Entries
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
        
        {filteredJournals.length === 0 ? (
          <EmptyState>
            <h3>No journal entries found</h3>
            <p>
              {journals.length === 0
                ? 'Start writing your thoughts and feelings to track your mental health journey.'
                : 'No entries match your current filters. Try adjusting your search or filters.'}
            </p>
            <Button as={Link} to="/journal/new">
              Write Your First Entry
            </Button>
          </EmptyState>
        ) : (
          <JournalGrid>
            {filteredJournals.map(journal => (
              <JournalCard
                key={journal._id}
                hoverable
                clickable
                as={Link}
                to={`/journal/${journal._id}`}
              >
                <JournalDate>{formatDate(journal.createdAt)}</JournalDate>
                <JournalTitle>{journal.title}</JournalTitle>
                
                {journal.mood && (
                  <MoodIndicator value={journal.mood}>
                    <span></span>
                    <p>Mood: {journal.mood}/10 - {getMoodDescription(journal.mood)}</p>
                  </MoodIndicator>
                )}
                
                <JournalContent>{journal.content}</JournalContent>
                
                {journal.tags && journal.tags.length > 0 && (
                  <TagsContainer>
                    {journal.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </TagsContainer>
                )}
              </JournalCard>
            ))}
          </JournalGrid>
        )}
      </Container>
    </JournalContainer>
  );
};

export default Journal;
