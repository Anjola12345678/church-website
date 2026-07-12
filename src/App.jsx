// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// import { AuthProvider, useAuth } from "./Context/AuthContext";
// import ProtectedRoute from "./Components/ProtectedRoute";
// import DashboardLayout from "./Components/DashboardLayout";
// import AdminLayout from "./Components/AdminLayout";

// import Landing from "./pages/LandingPage";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";

// // User Pages
// import UserDashboard from './pages/User/UserDashboard';
// import BiblePage from './pages/User/BiblePage';
// import SermonPage from './pages/User/SermonPage';
// import QuizPage from './pages/User/QuizPage';
// import Notifications from './pages/User/Notifications';
// import  EventPage  from './pages/User/EventPage';
// import ContactPage from './pages/User/ContactPage';
// import ProfilePage from './pages/User/ProfilePage';

// // Admin Pages
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import AdminNotifications from './pages/Admin/AdminNotifications';
// import AdminSermon from './pages/Admin/AdminSermon';
// import AdminQuizzes from './pages/Admin/AdminQuizzes';
// import AdminPrayers from './pages/Admin/AdminPrayers';
// import AdminEvents from './pages/Admin/AdminEvents';
// import AdminMessages from './pages/Admin/AdminMessages';
// import AdminUsers from './pages/Admin/AdminUsers';
// import AdminSettings from './pages/Admin/AdminSettings';
// import AdminProfilePage from './pages/Admin/AdminProfile';

// function App() {

//   return (
//     <BrowserRouter>
//     <AuthProvider>
//       {/* <Router> */}
//         <ToastContainer position="top-center" />
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />

//           {/* User Routes wrapped in Layout */}
//           <Route path="/user-dashboard" element={<ProtectedRoute><DashboardLayout><UserDashboard /></DashboardLayout></ProtectedRoute>} />
//           <Route path="/bible" element={<ProtectedRoute><DashboardLayout><BiblePage /></DashboardLayout></ProtectedRoute>} />
//           <Route path="/sermons" element={<ProtectedRoute><DashboardLayout><SermonPage /></DashboardLayout></ProtectedRoute>} />
//           <Route path="/quiz" element={<ProtectedRoute><DashboardLayout><QuizPage /></DashboardLayout></ProtectedRoute>} />
//           <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />
//           <Route path="/events" element={<ProtectedRoute><DashboardLayout><EventPage /></DashboardLayout></ProtectedRoute>} />
//           <Route path="/contact" element={<ProtectedRoute><DashboardLayout><ContactPage /></DashboardLayout></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />

//           {/* Admin Routes wrapped in Layout */}
//           <Route path="/admin-dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-notifications" element={<ProtectedRoute><AdminLayout><AdminNotifications /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-sermon" element={<ProtectedRoute><AdminLayout><AdminSermon /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-quizzes" element={<ProtectedRoute><AdminLayout><AdminQuizzes /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-prayers" element={<ProtectedRoute><AdminLayout><AdminPrayers /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-events" element={<ProtectedRoute><AdminLayout><AdminEvents /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-messages" element={<ProtectedRoute><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-users" element={<ProtectedRoute><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
//           <Route path="/admin-profile" element={<ProtectedRoute><AdminLayout><AdminProfilePage /></AdminLayout></ProtectedRoute>} />
//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       {/* </Router> */}
//     </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;





// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { AuthProvider, useAuth } from "./Context/AuthContext";
import { ThemeProvider } from "./Context/ThemeContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import DashboardLayout from "./Components/DashboardLayout";
import AdminLayout from "./Components/AdminLayout";

import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// User Pages
import UserDashboard from './pages/User/UserDashboard';
import BiblePage from './pages/User/BiblePage';
import SermonPage from './pages/User/SermonPage';
import QuizPage from './pages/User/QuizPage';
import Notifications from './pages/User/Notifications';
import  EventPage  from './pages/User/EventPage';
// import ContactPage from './pages/User/ContactPage';
import ProfilePage from './pages/User/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminSermon from './pages/Admin/AdminSermon';
import AdminQuizzes from './pages/Admin/AdminQuizzes';
import AdminPrayers from './pages/Admin/AdminPrayers';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminMessages from './pages/Admin/AdminMessages';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminProfilePage from './pages/Admin/AdminProfile';

function App() {

  return (
    <BrowserRouter>
    <ThemeProvider>
    <AuthProvider>
      {/* <Router> */}
        <ToastContainer position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* User Routes wrapped in Layout */}
          <Route path="/user-dashboard" element={<ProtectedRoute><DashboardLayout><UserDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/bible" element={<ProtectedRoute><DashboardLayout><BiblePage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/sermons" element={<ProtectedRoute><DashboardLayout><SermonPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><DashboardLayout><QuizPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><DashboardLayout><EventPage /></DashboardLayout></ProtectedRoute>} />
          {/* <Route path="/contact" element={<ProtectedRoute><DashboardLayout><ContactPage /></DashboardLayout></ProtectedRoute>} /> */}
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />

          {/* Admin Routes wrapped in Layout */}
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-notifications" element={<ProtectedRoute><AdminLayout><AdminNotifications /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-sermon" element={<ProtectedRoute><AdminLayout><AdminSermon /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-quizzes" element={<ProtectedRoute><AdminLayout><AdminQuizzes /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-prayers" element={<ProtectedRoute><AdminLayout><AdminPrayers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-events" element={<ProtectedRoute><AdminLayout><AdminEvents /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-messages" element={<ProtectedRoute><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-users" element={<ProtectedRoute><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin-profile" element={<ProtectedRoute><AdminLayout><AdminProfilePage /></AdminLayout></ProtectedRoute>} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      {/* </Router> */}
    </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
