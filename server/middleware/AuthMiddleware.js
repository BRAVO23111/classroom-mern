import jwt from 'jsonwebtoken';
import { UserModel } from '../model/User.js';


const secret = "mysecret";

// Middleware to verify roles
const authenticateRole = (...roles) => async (req, res, next) => {
  try {
    const { user } = req;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  } catch (error) {
    console.error('Error in authenticateRole middleware:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Middleware to authenticate user via JWT
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        console.error('Error decoding token:', err);
        return res.status(401).json({ message: 'Invalid or expired token.' });
      }

      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export { authMiddleware, authenticateRole };
