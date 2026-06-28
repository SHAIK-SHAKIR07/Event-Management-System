import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import MyTickets from './pages/MyTickets';
import CheckIn from './pages/CheckIn';
import Dashboard from './pages/Dashboard';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role && user.role !== 'admin')
    return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/my-tickets" element={
          <PrivateRoute><MyTickets /></PrivateRoute>
        } />
        <Route path="/create-event" element={
          <PrivateRoute role="organizer"><CreateEvent /></PrivateRoute>
        } />
        <Route path="/checkin" element={
          <PrivateRoute role="organizer"><CheckIn /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute role="organizer"><Dashboard /></PrivateRoute>
        } />
        <Route path="/my-events" element={
          <PrivateRoute role="organizer"><MyEvents /></PrivateRoute>
        } />
        <Route path="/edit-event/:id" element={
          <PrivateRoute role="organizer"><EditEvent /></PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}