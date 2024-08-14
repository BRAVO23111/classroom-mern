import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './Home';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://classroom-mern-5w3y.onrender.com/teacher/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setStudents(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://classroom-mern-5w3y.onrender.com/teacher/student/${editingStudent._id}`, editingStudent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://classroom-mern-5w3y.onrender.com/teacher/student/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://classroom-mern-5w3y.onrender.com/teacher/timetable', { timetable }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      alert('Timetable created successfully');
    } catch (error) {
      console.error('Error creating timetable:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
        <HomePage/>
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      
      {/* Student List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Students</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="border border-gray-300 p-2">{student.name}</td>
                <td className="border border-gray-300 p-2">{student.email}</td>
                <td className="border border-gray-300 p-2">
                  <button 
                    onClick={() => handleEditStudent(student)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteStudent(student._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Student Form */}
      {editingStudent && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Edit Student</h2>
          <form onSubmit={handleUpdateStudent} className="space-y-4">
            <div>
              <label className="block mb-1">Name:</label>
              <input 
                type="text" 
                value={editingStudent.name} 
                onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Email:</label>
              <input 
                type="email" 
                value={editingStudent.email} 
                onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Update Student
            </button>
          </form>
        </div>
      )}

      {/* Timetable Creation Form (OPTIONAL) */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Create Timetable</h2>
        <form onSubmit={handleCreateTimetable} className="space-y-4">
          {/* Add input fields for timetable creation here */}
          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
            Create Timetable
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherDashboard;