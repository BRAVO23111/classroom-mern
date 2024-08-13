import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userState } from '../atoms/atoms';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); // Default role set to Student
  const [user, setUser] = useRecoilState(userState);
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
        alert("registered")
        navigate('/login');
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleRegister}>
        <h2 className="text-2xl mb-4">Register</h2>
        <input
          className="border p-2 w-full mb-4"
          type="name"
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
        <button className="bg-blue-500 text-white p-2 w-full rounded" type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
