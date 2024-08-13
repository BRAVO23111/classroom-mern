import express from 'express';
import { authenticateRole, authMiddleware } from '../middleware/AuthMiddleware.js';
import { ClassroomModel } from '../model/Classroom.js';
import { UserModel } from '../model/User.js';


const router = express.Router();

// Get classroom details including other students
router.get('/classroom-all', authMiddleware ,authenticateRole('Student'), async (req, res) => {
  try {
    const student = await UserModel.findById(req.user.id);
    if (!student || student.role !== 'Student') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const classroom = await ClassroomModel.findOne({ students: req.user.id })
      .populate('students', 'name email')
      .populate('teacher', 'name email');

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.json(classroom);
  } catch (error) {
    console.error('Error fetching classroom details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get timetable (OPTIONAL)
router.get('/timetable', authMiddleware,authenticateRole('Student'), async (req, res) => {
  try {
    const student = await UserModel.findById(req.user.id);
    if (!student || student.role !== 'Student')
     {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const classroom = await ClassroomModel.findOne({ students: req.user.id });
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Assuming timetable is stored in the classroom model
    const timetable = classroom.timetable || [];

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export  {router as StudentRouter};