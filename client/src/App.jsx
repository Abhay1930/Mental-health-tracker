import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIProvider } from './context/AIContext';
import GlobalStyles from './styles/GlobalStyles';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import MoodEntryForm from './pages/MoodEntryForm';
import MoodDetail from './pages/MoodDetail';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Exercises from './pages/Exercises';
import ExerciseDetail from './pages/ExerciseDetail';
import Profile from './pages/Profile';
import Journal from './pages/Journal';
import JournalForm from './pages/JournalForm';
import JournalDetail from './pages/JournalDetail';
import Goals from './pages/Goals';
import GoalForm from './pages/GoalForm';
import GoalDetail from './pages/GoalDetail';
import Community from './pages/Community';
import PostForm from './pages/PostForm';
import PostDetail from './pages/PostDetail';
import UserProfile from './pages/UserProfile';
import CommunityModeration from './pages/CommunityModeration';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AccessibilityMenu from './components/common/AccessibilityMenu';
import Chatbot from './components/chat/Chatbot';
import AIChat from './pages/AIChat';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AIProvider>
            <GlobalStyles />
            <Layout>
              <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Mood Tracker Routes */}
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

              {/* Resources Routes */}
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

              {/* Exercises Routes */}
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

              {/* Journal Routes */}
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

              {/* Goals Routes */}
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

              {/* Community Routes */}
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

              {/* Profile Route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* AI Chat Route */}
              <Route path="/ai-chat" element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              } />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <AccessibilityMenu />
              <Chatbot />
            </Layout>
          </AIProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
