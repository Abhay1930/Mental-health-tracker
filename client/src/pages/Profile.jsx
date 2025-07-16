import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Container from '../components/common/Container';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileContainer = styled.div`
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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-lg);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const ProfileMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const ProfileAvatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  margin: 0 auto var(--spacing-md);
`;

const ProfileInfo = styled.div`
  text-align: center;
`;

const ProfileName = styled.h2`
  margin-bottom: var(--spacing-xs);
`;

const ProfileEmail = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
`;

const StatCard = styled.div`
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: var(--font-size-xlarge);
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: var(--font-size-small);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormRow = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--error-color);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
`;

const SuccessMessage = styled.div`
  background-color: rgba(76, 217, 100, 0.1);
  color: var(--success-color);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
`;

const DangerZone = styled.div`
  padding: var(--spacing-md);
  border: 1px solid var(--error-color);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-lg);
`;

const DangerTitle = styled.h4`
  color: var(--error-color);
  margin-bottom: var(--spacing-sm);
`;

const DangerDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
`;

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  
  // Stats (these would come from API in a real app)
  const [stats, setStats] = useState({
    moodEntries: 0,
    averageMood: 0,
    exercisesCompleted: 0,
    daysTracked: 0
  });
  
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        username: currentUser.username || ''
      });
      
      // Fetch user stats
      fetchUserStats();
    }
  }, [currentUser]);
  
  const fetchUserStats = async () => {
    try {
      // This would be an API call in a real app
      // For now, we'll use mock data
      setStats({
        moodEntries: 24,
        averageMood: 7.2,
        exercisesCompleted: 12,
        daysTracked: 18
      });
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Clear success message when user types
    if (profileSuccess) {
      setProfileSuccess(null);
    }
    
    // Clear error message when user types
    if (profileError) {
      setProfileError(null);
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear success message when user types
    if (passwordSuccess) {
      setPasswordSuccess(null);
    }
    
    // Clear error message when user types
    if (passwordError) {
      setPasswordError(null);
    }
  };
  
  const validateProfileForm = () => {
    if (!profileData.firstName.trim()) {
      setProfileError('First name is required');
      return false;
    }
    
    if (!profileData.lastName.trim()) {
      setProfileError('Last name is required');
      return false;
    }
    
    if (!profileData.email.trim()) {
      setProfileError('Email is required');
      return false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(profileData.email)) {
      setProfileError('Invalid email address');
      return false;
    }
    
    if (!profileData.username.trim()) {
      setProfileError('Username is required');
      return false;
    } else if (profileData.username.length < 3) {
      setProfileError('Username must be at least 3 characters');
      return false;
    }
    
    return true;
  };
  
  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return false;
    } else if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return false;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // This would be an API call in a real app
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileSuccess('Profile updated successfully');
      setProfileError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setProfileError('Failed to update profile. Please try again.');
      setProfileSuccess(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // This would be an API call in a real app
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordSuccess('Password updated successfully');
      setPasswordError(null);
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError('Failed to update password. Please try again.');
      setPasswordSuccess(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getInitials = () => {
    if (!currentUser) return '';
    
    const firstName = currentUser.firstName || '';
    const lastName = currentUser.lastName || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <ProfileContainer>
      <Container>
        <PageHeader>
          <PageTitle>Profile Settings</PageTitle>
          <PageDescription>
            Manage your account settings and preferences.
          </PageDescription>
        </PageHeader>
        
        <ProfileGrid>
          <ProfileSidebar>
            <Card>
              <ProfileAvatar>
                {getInitials() || <i className="fas fa-user"></i>}
              </ProfileAvatar>
              <ProfileInfo>
                <ProfileName>
                  {currentUser?.firstName} {currentUser?.lastName}
                </ProfileName>
                <ProfileEmail>{currentUser?.email}</ProfileEmail>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </ProfileInfo>
            </Card>
            
            <Card title="Your Stats">
              <ProfileStats>
                <StatCard>
                  <StatValue>{stats.moodEntries}</StatValue>
                  <StatLabel>Mood Entries</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.averageMood.toFixed(1)}</StatValue>
                  <StatLabel>Average Mood</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.exercisesCompleted}</StatValue>
                  <StatLabel>Exercises Completed</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.daysTracked}</StatValue>
                  <StatLabel>Days Tracked</StatLabel>
                </StatCard>
              </ProfileStats>
            </Card>
          </ProfileSidebar>
          
          <ProfileMain>
            <Card title="Personal Information">
              {profileError && <ErrorMessage>{profileError}</ErrorMessage>}
              {profileSuccess && <SuccessMessage>{profileSuccess}</SuccessMessage>}
              
              <Form onSubmit={handleProfileSubmit}>
                <FormRow>
                  <Input
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    required
                  />
                  
                  <Input
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    required
                  />
                </FormRow>
                
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
                
                <Input
                  id="username"
                  name="username"
                  label="Username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                />
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card>
            
            <Card title="Change Password">
              {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
              {passwordSuccess && <SuccessMessage>{passwordSuccess}</SuccessMessage>}
              
              <Form onSubmit={handlePasswordSubmit}>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  helperText="Password must be at least 6 characters"
                  required
                />
                
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </Form>
              
              <DangerZone>
                <DangerTitle>Delete Account</DangerTitle>
                <DangerDescription>
                  Once you delete your account, there is no going back. Please be certain.
                </DangerDescription>
                <Button variant="danger">
                  Delete Account
                </Button>
              </DangerZone>
            </Card>
          </ProfileMain>
        </ProfileGrid>
      </Container>
    </ProfileContainer>
  );
};

export default Profile;
