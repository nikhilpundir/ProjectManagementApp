import jwt from 'jsonwebtoken'
import {User} from '../models'

export const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).populate('role');
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export const authorize = (requiredPermission) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (!role.permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};
