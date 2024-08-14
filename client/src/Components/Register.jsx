import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userState } from '../atoms/atoms';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); 
  const [user, setUser] = useRecoilState(userState);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        const { token, userId, role } = response.data;
        setUser({ user: userId, role: role });
        localStorage.setItem('authToken', token);
        alert("Registered successfully");
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        console.error('Error registering:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleRegister}>
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} 
        <input
          className="border p-2 w-full mb-4"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Principal">Principal</option>
        </select>
        <button className="bg-blue-500 text-white p-2 w-full rounded" type="submit">
          Register
        </button>
        <p className="text-center text-gray-600 mt-3">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
