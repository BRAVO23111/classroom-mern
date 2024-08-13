import React from 'react';
import { useRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { userState } from '../atoms/atoms';

function HomePage() {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); 
    localStorage.removeItem('authToken'); 
    navigate('/login'); 
  };

  return (
    <div>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">School Management System</h1>
          <div>
            {user ? (
              <>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-white text-blue-500 px-4 py-2 rounded">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div className="container mx-auto mt-8">
        <h2 className="text-3xl text-center">Welcome to the School Management System</h2>
      </div>
    </div>
  );
}

export default HomePage;
