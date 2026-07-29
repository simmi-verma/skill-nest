import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillnest_super_secret_key_2026_safe');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User session invalid' });
      }

      next();
    } catch (error) {
      console.error('Session authentication error:', error);
      return res.status(401).json({ success: false, message: 'Authentication expired, please log in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Requires administrator permissions' });
  }
};
