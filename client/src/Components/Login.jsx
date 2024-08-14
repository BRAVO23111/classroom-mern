import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userState } from '../atoms/atoms';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://classroom-mern-5w3y.onrender.com/auth/login', {
        email,
        password,
        role, 
      });

      if (response.status === 200) {
        const { token, userId, role } = response.data;
        setUser({ user: userId, role: role });
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role);

        if (role === 'Principal') {
          navigate('/principal');
        } else if (role === 'Teacher') {
          navigate('/teacher');
        } else if (role === 'Student') {
          navigate('/student');
        }
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl mb-4">Login</h2>
       
        <input
          className="border p-2 w-full mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="border p-2 w-full mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
        </select>
        <button className="bg-blue-500 text-white p-2 w-full rounded mb-4" type="submit">
          Login
        </button>
        <p className="text-center text-gray-600">
          Not registered?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
