import express from 'express';
import { authenticateRole, authMiddleware } from '../middleware/AuthMiddleware.js';

import { ClassroomModel } from '../model/Classroom.js';
import { UserModel } from '../model/User.js';

const router = express.Router();

// Get students in teacher's classroom
router.get('/students', authMiddleware , authenticateRole('Teacher'), async (req, res) => {
  try {
    const classroom = await ClassroomModel.findOne({ teacher: req.user.id }).populate('students');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json(classroom.students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student details
router.put('/student/:id', authMiddleware , authenticateRole('Teacher'), async (req, res) => {
  try {
    const student = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/student/:id', authMiddleware , authenticateRole('Teacher'), async (req, res) => {
  try {
    const student = await UserModel.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Remove student from classroom
    await Classroom.updateMany({}, { $pull: { students: req.params.id } });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create timetable (OPTIONAL)
router.post('/timetable', authMiddleware , authenticateRole('Teacher'), async (req, res) => {
  try {
    const classroom = await ClassroomModel.findOne({ teacher: req.user.id });
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json({ message: 'Timetable created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as TeacherRouter };