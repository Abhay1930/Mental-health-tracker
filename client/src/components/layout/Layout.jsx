import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  width: 100%;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: var(--spacing-lg);
  margin-left: ${props => props.sidebarOpen ? '250px' : '0'};
  transition: margin-left var(--transition-normal);

  @media (max-width: 768px) {
    margin-left: 0;
    padding: var(--spacing-md);
  }
`;

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is public (login, register, landing)
  const isPublicRoute = ['/login', '/register', '/'].includes(location.pathname);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Redirect to login if not authenticated and trying to access protected route
  useEffect(() => {
    if (!currentUser && !isPublicRoute) {
      navigate('/login');
    }
  }, [currentUser, isPublicRoute, navigate]);

  return (
    <LayoutContainer>
      <Navbar toggleSidebar={toggleSidebar} />

      <MainContent>
        {!isPublicRoute && currentUser && (
          <Sidebar isOpen={sidebarOpen} />
        )}

        <ContentWrapper sidebarOpen={!isPublicRoute && sidebarOpen && currentUser}>
          {children}
        </ContentWrapper>
      </MainContent>

      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
