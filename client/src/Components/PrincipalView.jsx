import { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/atoms";
import HomePage from "./Home";

const PrincipalView = () => {
  const [activeTab, setActiveTab] = useState("classrooms");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroom, setNewClassroom] = useState({ name: "", startTime: "", endTime: "", days: "" });
  const [studentIds, setStudentIds] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "" });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const user = useRecoilValue(userState);

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchClassrooms();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/users?role=Teacher", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/users?role=Student", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get("http://localhost:3000/classroom/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/classroom/create-classroom", newClassroom, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setClassrooms([...classrooms, response.data]);
      setNewClassroom({ name: "", startTime: "", endTime: "", days: "" });
    } catch (error) {
      console.error("Error creating classroom:", error);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/classroom/create-teacher", { ...newTeacher, role: "Teacher" }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      alert("Teacher has been created")
      setNewTeacher({ name: "", email: "", password: "" });
      fetchTeachers();
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/classroom/assign-teacher", { classroomId, teacherId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      fetchClassrooms(); // Refresh the list
    } catch (error) {
      console.error("Error assigning teacher:", error);
    }
  };

  const handleAssignStudents = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/classroom/assign-student", { classroomId, studentIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      fetchClassrooms(); // Refresh the list
    } catch (error) {
      console.error("Error assigning students:", error);
    }
  };
  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    console.log(`${editingTeacher._id}`);
    try {
      await axios.put(`http://localhost:3000/classroom/update-teacher/${editingTeacher._id}`, editingTeacher, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      fetchTeachers(); 
      setEditingTeacher(null); 
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };
  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:3000/classroom/delete-teacher/${teacherId._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      fetchTeachers(); // Refresh the list of teachers
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };  
  return (
    <div className="p-6">
      <HomePage />
      <h1 className="text-3xl mb-4">Principal Dashboard</h1>

      {/* Tabs for navigation */}
      <div className="mb-4">
        <ul className="flex border-b">
          <li className={`mr-1 ${activeTab === "classrooms" ? "border-b-2 border-blue-500" : ""}`}>
            <button onClick={() => setActiveTab("classrooms")} className="p-2">Classrooms</button>
          </li>
          <li className={`mr-1 ${activeTab === "teachers" ? "border-b-2 border-blue-500" : ""}`}>
            <button onClick={() => setActiveTab("teachers")} className="p-2">Create Teacher</button>
          </li>
          <li className={`mr-1 ${activeTab === "students" ? "border-b-2 border-blue-500" : ""}`}>
            <button onClick={() => setActiveTab("students")} className="p-2">Students</button>
          </li>
          <li className={`mr-1 ${activeTab === "assignTeacher" ? "border-b-2 border-blue-500" : ""}`}>
            <button onClick={() => setActiveTab("assignTeacher")} className="p-2">Assign Teacher</button>
          </li>
          <li className={`mr-1 ${activeTab === "assignStudents" ? "border-b-2 border-blue-500" : ""}`}>
            <button onClick={() => setActiveTab("assignStudents")} className="p-2">Assign Students</button>
          </li>
          <li className={`mr-1 ${activeTab === "editTeachers" ? "border-b-2 border-blue-500" : ""}`}>
            <button onClick={() => setActiveTab("editTeachers")} className="p-2">Teacher's List</button>
          </li>
        </ul>
      </div>

      {activeTab === "classrooms" && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl mb-2">Create Classroom</h2>
            <form onSubmit={handleCreateClassroom} className="bg-white p-4 rounded shadow-md">
              <label className="block mb-2">
                Classroom Name
                <input
                  type="text"
                  placeholder="Classroom Name"
                  value={newClassroom.name}
                  onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                  className="border p-2 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                Start Time
                <input
                  type="time"
                  value={newClassroom.startTime}
                  onChange={(e) => setNewClassroom({ ...newClassroom, startTime: e.target.value })}
                  className="border p-2 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                End Time
                <input
                  type="time"
                  value={newClassroom.endTime}
                  onChange={(e) => setNewClassroom({ ...newClassroom, endTime: e.target.value })}
                  className="border p-2 w-full mt-1"
                />
              </label>
              <label className="block mb-4">
                Days
                <input
                  type="text"
                  placeholder="Days"
                  value={newClassroom.days}
                  onChange={(e) => setNewClassroom({ ...newClassroom, days: e.target.value })}
                  className="border p-2 w-full mt-1"
                />
              </label>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Classroom</button>
            </form>
          </div>
  </>
      )}

          {/* <div className="mb-6">
            <h2 className="text-2xl mb-2">Assign Teacher</h2>
            <form onSubmit={handleAssignTeacher} className="bg-white p-4 rounded shadow-md">
              <label className="block mb-2">
                Select Classroom
                <select
                  value={classroomId}
                  onChange={(e) => setClassroomId(e.target.value)}
                  className="border p-2 w-full mt-1"
                >
                  <option value="">Select Classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom._id} value={classroom._id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-4">
                Select Teacher
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="border p-2 w-full mt-1"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.email}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Assign Teacher</button>
            </form>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl mb-2">Assign Students</h2>
            <form onSubmit={handleAssignStudents} className="bg-white p-4 rounded shadow-md">
              <label className="block mb-2">
                Select Classroom
                <select
                  value={classroomId}
                  onChange={(e) => setClassroomId(e.target.value)}
                  className="border p-2 w-full mt-1"
                >
                  <option value="">Select Classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom._id} value={classroom._id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-4">
                Select Students
                <select
                  multiple
                  value={studentIds}
                  onChange={(e) => setStudentIds(Array.from(e.target.selectedOptions, (option) => option.value))}
                  className="border p-2 w-full mt-1"
                >
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.email}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Assign Students</button>
            </form>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl mb-2">Classrooms</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Start Time</th>
                  <th className="py-2 px-4 border-b">End Time</th>
                  <th className="py-2 px-4 border-b">Days</th>
                  <th className="py-2 px-4 border-b">Teacher</th>
                  <th className="py-2 px-4 border-b">Students</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom) => (
                  <tr key={classroom._id}>
                    <td className="py-2 px-4 border-b">{classroom.name}</td>
                    <td className="py-2 px-4 border-b">{classroom.startTime}</td>
                    <td className="py-2 px-4 border-b">{classroom.endTime}</td>
                    <td className="py-2 px-4 border-b">{classroom.days}</td>
                    <td className="py-2 px-4 border-b">
                      {classroom.teacher ? classroom.teacher.email : 'None'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {classroom.students.length > 0 ? (
                        <div>
                          {classroom.students.map((student) => (
                            <div key={student._id} className="text-sm">{student.email}</div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No students assigned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )} */}
      {activeTab === "assignTeacher" && (
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Assign Teacher</h2>
          <form onSubmit={handleAssignTeacher} className="bg-white p-4 rounded shadow-md">
            <label className="block mb-2">
              Select Classroom
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="border p-2 w-full mt-1 rounded-lg shadow-sm"
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-4">
              Select Teacher
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="border p-2 w-full mt-1 rounded-lg shadow-sm"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.email}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Assign Teacher</button>
          </form>
        </div>
      )}

{activeTab === "assignStudents" && (
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Assign Students</h2>
          <form onSubmit={handleAssignStudents} className="bg-white p-4 rounded shadow-md">
            <label className="block mb-2">
              Select Classroom
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="border p-2 w-full mt-1 rounded-lg shadow-sm"
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-4">
              Select Students
              <select
                multiple
                value={studentIds}
                onChange={(e) => setStudentIds(Array.from(e.target.selectedOptions, (option) => option.value))}
                className="border p-2 w-full mt-1 rounded-lg shadow-sm"
              >
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.email}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Assign Students</button>
          </form>
        </div>
      )}


      {activeTab === "classrooms" && (
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Classrooms</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Start Time</th>
                <th className="py-3 px-4 border-b">End Time</th>
                <th className="py-3 px-4 border-b">Days</th>
                <th className="py-3 px-4 border-b">Teacher</th>
                <th className="py-3 px-4 border-b">Students</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom) => (
                <tr key={classroom._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{classroom.name}</td>
                  <td className="py-3 px-4 border-b">{classroom.startTime}</td>
                  <td className="py-3 px-4 border-b">{classroom.endTime}</td>
                  <td className="py-3 px-4 border-b">{classroom.days}</td>
                  <td className="py-3 px-4 border-b">
                    {classroom.teacher ? classroom.teacher.email : 'None'}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {classroom.students.length > 0 ? (
                      <div>
                        {classroom.students.map((student) => (
                          <div key={student._id} className="text-sm">{student.email}</div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No students assigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "teachers" && (
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Create Teacher</h2>
          <form onSubmit={handleCreateTeacher} className="bg-white p-4 rounded shadow-md">
            <label className="block mb-2">
              Teacher Name
              <input
                type="text"
                placeholder="Teacher Name"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                className="border p-2 w-full mt-1"
              />
            </label>
            <label className="block mb-2">
              Teacher Email
              <input
                type="email"
                placeholder="Teacher Email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                className="border p-2 w-full mt-1"
              />
            </label>
            <label className="block mb-4">
              Password
              <input
                type="password"
                placeholder="Password"
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                className="border p-2 w-full mt-1"
              />
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Teacher</button>
          </form>
        </div>
      )}

      {activeTab === "students" && (
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Students</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="py-2 px-4 border-b text-center">{student.name}</td>
                  <td className="py-2 px-4 border-b text-center">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "editTeachers" && (
  <div className="mb-6">
    <h2 className="text-2xl mb-2">Edit Teachers</h2>
    <table className="min-w-full bg-white border border-gray-200 rounded shadow-md">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Email</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {teachers.map((teacher) => (
          <tr key={teacher._id}>
            <td className="py-2 px-4 border-b">
              {editingTeacher && editingTeacher._id === teacher._id ? (
                <input
                  type="text"
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="border p-2 w-full"
                />
              ) : (
                teacher.name
              )}
            </td>
            <td className="py-2 px-4 border-b">
              {editingTeacher && editingTeacher._id === teacher._id ? (
                <input
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="border p-2 w-full"
                />
              ) : (
                teacher.email
              )}
            </td>
            <td className="py-2 px-4 border-b">
              {editingTeacher && editingTeacher._id === teacher._id ? (
                <button onClick={handleUpdateTeacher} className="bg-blue-500 text-white p-1 rounded">Save</button>
              ) : (
                <>
                  <button onClick={() => setEditingTeacher(teacher)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDeleteTeacher(teacher)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default PrincipalView;
