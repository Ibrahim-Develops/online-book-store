import jwt from 'jsonwebtoken';
import Users from '../../Models/UserModel.js';

const Authorization = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return res.status(400).json({ message: 'Cookies are not enabled or accessible.' });
    }

    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'You are not allowed to access this webpage.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    const user = await Users.findById(decoded.user_ID);

    if (!user) {
      return res.status(403).json({ message: 'Invalid token or user does not exist.' });
    }

    req.userId = user
    req.userRole = user.role;
    
    next();
  } catch (error) {
    console.log('Authorization error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default Authorization;
