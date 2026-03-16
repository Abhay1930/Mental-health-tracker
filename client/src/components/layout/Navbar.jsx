import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--card-background);
  box-shadow: 0 2px 4px var(--shadow-color);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: var(--spacing-sm) var(--spacing-md);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--primary-color);
  }

  @media (max-width: 768px) {
    margin-right: var(--spacing-sm);
  }
`;

const Logo = styled(Link)`
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;

  &:hover {
    color: var(--secondary-color);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--card-background);
    padding: var(--spacing-md);
    box-shadow: 0 4px 6px var(--shadow-color);
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--background-color);
    color: var(--primary-color);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: var(--spacing-sm);
    text-align: center;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const UserName = styled.span`
  font-weight: 500;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Navbar = ({ toggleSidebar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <NavbarContainer>
      <LogoContainer>
        {currentUser && (
          <MenuButton onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </MenuButton>
        )}
        <Logo to="/">MindTrack</Logo>
      </LogoContainer>

      <MobileMenuButton onClick={toggleMobileMenu}>
        <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
      </MobileMenuButton>

      <NavLinks isOpen={mobileMenuOpen}>
        {currentUser ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/mood-tracker">Mood Tracker</NavLink>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/goals">Goals</NavLink>
            <NavLink to="/exercises">Exercises</NavLink>
            <NavLink to="/resources">Resources</NavLink>
            <NavLink to="/community">Community</NavLink>
            <NavLink to="/ai-chat">
              <i className="fas fa-robot"></i> AI Assistant
            </NavLink>
            <NavActions>
              <ThemeToggle />
              <UserInfo>
                <UserName>Hello, {currentUser.firstName || currentUser.username}</UserName>
                <Button size="small" variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </UserInfo>
            </NavActions>
          </>
        ) : (
          <>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavActions>
              <ThemeToggle />
              <Button size="small" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </NavActions>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
