import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIProvider } from './context/AIContext';
import GlobalStyles from './styles/GlobalStyles';

import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import AccessibilityMenu from './components/common/AccessibilityMenu';
import Chatbot from './components/chat/Chatbot';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const MoodEntryForm = lazy(() => import('./pages/MoodEntryForm'));
const MoodDetail = lazy(() => import('./pages/MoodDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));
const Exercises = lazy(() => import('./pages/Exercises'));
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Journal = lazy(() => import('./pages/Journal'));
const JournalForm = lazy(() => import('./pages/JournalForm'));
const JournalDetail = lazy(() => import('./pages/JournalDetail'));
const Goals = lazy(() => import('./pages/Goals'));
const GoalForm = lazy(() => import('./pages/GoalForm'));
const GoalDetail = lazy(() => import('./pages/GoalDetail'));
const Community = lazy(() => import('./pages/Community'));
const PostForm = lazy(() => import('./pages/PostForm'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const CommunityModeration = lazy(() => import('./pages/CommunityModeration'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AIChat = lazy(() => import('./pages/AIChat'));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <div className="spinner" style={{ 
      border: '4px solid rgba(0, 0, 0, 0.1)', 
      width: '36px', height: '36px', 
      borderRadius: '50%', 
      borderLeftColor: '#4361ee', 
      animation: 'spin 1s linear infinite' 
    }}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <AIProvider>
              <GlobalStyles />
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>

                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />

                    <Route path="/mood-tracker" element={
                      <ProtectedRoute>
                        <MoodTracker />
                      </ProtectedRoute>
                    } />
                    <Route path="/mood-tracker/new" element={
                      <ProtectedRoute>
                        <MoodEntryForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/mood-tracker/:id" element={
                      <ProtectedRoute>
                        <MoodDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/mood-tracker/:id/edit" element={
                      <ProtectedRoute>
                        <MoodEntryForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/resources" element={
                      <ProtectedRoute>
                        <Resources />
                      </ProtectedRoute>
                    } />
                    <Route path="/resources/:id" element={
                      <ProtectedRoute>
                        <ResourceDetail />
                      </ProtectedRoute>
                    } />

                    <Route path="/exercises" element={
                      <ProtectedRoute>
                        <Exercises />
                      </ProtectedRoute>
                    } />
                    <Route path="/exercises/:id" element={
                      <ProtectedRoute>
                        <ExerciseDetail />
                      </ProtectedRoute>
                    } />

                    <Route path="/journal" element={
                      <ProtectedRoute>
                        <Journal />
                      </ProtectedRoute>
                    } />
                    <Route path="/journal/new" element={
                      <ProtectedRoute>
                        <JournalForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/journal/:id" element={
                      <ProtectedRoute>
                        <JournalDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/journal/:id/edit" element={
                      <ProtectedRoute>
                        <JournalForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/goals" element={
                      <ProtectedRoute>
                        <Goals />
                      </ProtectedRoute>
                    } />
                    <Route path="/goals/new" element={
                      <ProtectedRoute>
                        <GoalForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/goals/:id" element={
                      <ProtectedRoute>
                        <GoalDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/goals/:id/edit" element={
                      <ProtectedRoute>
                        <GoalForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/community" element={
                      <ProtectedRoute>
                        <Community />
                      </ProtectedRoute>
                    } />
                    <Route path="/community/new" element={
                      <ProtectedRoute>
                        <PostForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/community/:id" element={
                      <ProtectedRoute>
                        <PostDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/community/:id/edit" element={
                      <ProtectedRoute>
                        <PostForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/community/user/:userId" element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="/community/moderation" element={
                      <ProtectedRoute>
                        <CommunityModeration />
                      </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />

                    <Route path="/ai-chat" element={
                      <ProtectedRoute>
                        <AIChat />
                      </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
                <AccessibilityMenu />
                <Chatbot />
              </Layout>
            </AIProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
