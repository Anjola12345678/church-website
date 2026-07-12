

// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { auth } from '../firebase/config';

// const ProtectedRoute = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // onAuthStateChanged is the correct way to handle Firebase sessions
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Show a loading spinner/blank screen while Firebase determines auth status
//   if (loading) {
//     return <div>Loading...</div>; 
//   }

//   // If no user, redirect to login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;





import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const RoleRoute = ({ children, requiredRole }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-900"></div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  
  // Security: Check if the user has the required role
  if (userData?.role !== requiredRole) {
    return <Navigate to={userData?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />;
  }

  return children;
};

export default RoleRoute;