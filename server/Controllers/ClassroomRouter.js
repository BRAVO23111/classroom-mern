import express from 'express';
import bcrypt from 'bcrypt';
import { authenticateRole, authMiddleware } from '../middleware/AuthMiddleware.js';
import { ClassroomModel } from '../model/Classroom.js';
import { UserModel } from '../model/User.js';

const router = express.Router();

// Create a new classroom
router.post('/create-classroom', authMiddleware, authenticateRole('Principal'), async (req, res) => {
  try {
    const { name, startTime, endTime, days } = req.body;

    const newClassroom = new ClassroomModel({ name, startTime, endTime, days });
    const classroom = await newClassroom.save();
    res.json(classroom);
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Assign a teacher to a classroom
router.post('/assign-teacher', authMiddleware, authenticateRole('Principal'), async (req, res) => {
  try {
    const { classroomId, teacherId } = req.body;

    const classroom = await ClassroomModel.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    classroom.teacher = teacher._id;
    const updatedClassroom = await classroom.save();
    res.json(updatedClassroom);
  } catch (error) {
    console.error('Error assigning teacher:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Assign multiple students to a classroom
router.post('/assign-student', authMiddleware, authenticateRole('Principal'), async (req, res) => {
  try {
    const { classroomId, studentIds } = req.body;

    // Validate input
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'Student IDs are required and should be an array' });
    }

    // Find the classroom
    const classroom = await ClassroomModel.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Find and validate students
    const students = await UserModel.find({
      _id: { $in: studentIds },
      role: 'Student'
    });
    if (students.length !== studentIds.length) {
      return res.status(404).json({ message: 'One or more students not found' });
    }

    // Update classroom and students
    classroom.students = [...new Set([...classroom.students, ...studentIds])]; // Avoid duplicate entries
    await classroom.save();
    
    await UserModel.updateMany(
      { _id: { $in: studentIds }, role: 'Student' },
      { $set: { classroom: classroom._id } }
    );

    res.json({ message: 'Students assigned successfully' });
  } catch (error) {
    console.error('Error assigning students:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a new teacher
router.post('/create-teacher', authMiddleware, authenticateRole('Principal'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ name, email, password: hashedPassword, role: 'Teacher' });
    await newUser.save();
    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all classrooms with populated teacher and students
router.get('/all', authMiddleware, authenticateRole('Principal', 'Teacher'), async (req, res) => {
  try {
    const classrooms = await ClassroomModel.find()
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    res.json(classrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});
router.put('/update-teacher/:id', authMiddleware, authenticateRole('Principal'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const teacher = await UserModel.findOneAndUpdate(
      { _id: id, role: 'Teacher' },
      { name, email },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/delete-teacher/:id' ,authMiddleware, authenticateRole('Principal'), async (req, res) => {
  try {
    const teacher = await UserModel.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({
      message : "Deleted"
    })
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
} )


export { router as classroomRouter };
