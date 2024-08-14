import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './Home';

const StudentDashboard = () => {
  const [classroom, setClassroom] = useState(null);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    fetchClassroomDetails();
    fetchTimetable();
  }, []);

  const fetchClassroomDetails = async () => {
    try {
      const response = await axios.get('https://classroom-mern-5w3y.onrender.com/student/classroom-all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setClassroom(response.data);
    } catch (error) {
      console.error('Error fetching classroom details:', error);
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await axios.get('https://classroom-mern-5w3y.onrender.com/student/timetable', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <HomePage />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Dashboard</h1>

      {classroom && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Classroom Details</h2>
          <div className="mb-4">
            <p className="text-lg"><strong className="text-gray-600">Name:</strong> {classroom.name}</p>
            <p className="text-lg"><strong className="text-gray-600">Teacher:</strong> {classroom.teacher.name} ({classroom.teacher.email})</p>
          </div>

          <h3 className="text-xl font-semibold mb-2 text-gray-600">Classmates</h3>
          <ul className="list-disc pl-5 space-y-2">
            {classroom.students.map(student => (
              <li key={student._id} className="text-gray-700">{student.name} ({student.email})</li>
            ))}
          </ul>
        </div>
      )}

      {timetable.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Timetable</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-3 text-left text-gray-600">Day</th>
                <th className="border border-gray-300 p-3 text-left text-gray-600">Subject</th>
                <th className="border border-gray-300 p-3 text-left text-gray-600">Start Time</th>
                <th className="border border-gray-300 p-3 text-left text-gray-600">End Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{entry.day}</td>
                  <td className="border border-gray-300 p-3">{entry.subject}</td>
                  <td className="border border-gray-300 p-3">{entry.startTime}</td>
                  <td className="border border-gray-300 p-3">{entry.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
