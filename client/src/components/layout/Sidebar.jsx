import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  width: 250px;
  background-color: var(--card-background);
  box-shadow: 2px 0 5px var(--shadow-color);
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform var(--transition-normal);
  z-index: 90;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
`;

const SidebarSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SidebarSectionTitle = styled.h3`
  font-size: var(--font-size-small);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  color: var(--text-color);
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-xs);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--background-color);
  }

  &.active {
    background-color: var(--primary-color);
    color: white;
  }

  i {
    margin-right: var(--spacing-sm);
    width: 20px;
    text-align: center;
  }
`;

const UserSection = styled.div`
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const UserName = styled.span`
  font-weight: 600;
  margin-top: var(--spacing-xs);
`;

const UserEmail = styled.span`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const Sidebar = ({ isOpen }) => {
  const { currentUser } = useAuth();

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarContent>
        <SidebarSection>
          <SidebarSectionTitle>Main</SidebarSectionTitle>
          <SidebarLink to="/dashboard">
            <i className="fas fa-home"></i>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/mood-tracker">
            <i className="fas fa-chart-line"></i>
            Mood Tracker
          </SidebarLink>
          <SidebarLink to="/journal">
            <i className="fas fa-book"></i>
            Journal
          </SidebarLink>
          <SidebarLink to="/goals">
            <i className="fas fa-bullseye"></i>
            Goals
          </SidebarLink>
          <SidebarLink to="/community">
            <i className="fas fa-users"></i>
            Community
          </SidebarLink>
        </SidebarSection>

        <SidebarSection>
          <SidebarSectionTitle>Activities</SidebarSectionTitle>
          <SidebarLink to="/exercises">
            <i className="fas fa-dumbbell"></i>
            Exercises
          </SidebarLink>
          <SidebarLink to="/meditation">
            <i className="fas fa-spa"></i>
            Meditation
          </SidebarLink>
          <SidebarLink to="/breathing">
            <i className="fas fa-wind"></i>
            Breathing
          </SidebarLink>
        </SidebarSection>

        <SidebarSection>
          <SidebarSectionTitle>Support</SidebarSectionTitle>
          <SidebarLink to="/resources">
            <i className="fas fa-hands-helping"></i>
            Resources
          </SidebarLink>
          <SidebarLink to="/community">
            <i className="fas fa-users"></i>
            Community
          </SidebarLink>
        </SidebarSection>

        <UserSection>
          <UserInfo>
            <UserName>{currentUser?.firstName} {currentUser?.lastName}</UserName>
            <UserEmail>{currentUser?.email}</UserEmail>
          </UserInfo>
          <SidebarLink to="/profile">
            <i className="fas fa-user-cog"></i>
            Profile Settings
          </SidebarLink>
        </UserSection>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
