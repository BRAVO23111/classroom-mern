import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
    navigate('/');
  };

  return (
    <div>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">School Management System</h1>
          <div>
            {isAuthenticated ? (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-white text-blue-500 px-4 py-2 rounded">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div className="container mx-auto mt-8">
        <h2 className="text-3xl text-center">
          {isAuthenticated ? 'Welcome back!' : 'Welcome to the School Management System'}
        </h2>
        {isAuthenticated && role && (
          <h3 className="text-xl text-center mt-4">
            Logged in as: <span className="font-semibold">{role}</span>
          </h3>
        )}
        {!isAuthenticated && (
          <h2 className="text-3xl text-center">
            Please login to view content
          </h2>
        )}
      </div>
    </div>
  );
}

export default HomePage;
