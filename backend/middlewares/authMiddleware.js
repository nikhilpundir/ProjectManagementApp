import jwt from 'jsonwebtoken'
import Users from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send({success:false, message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Users.findById(decoded.id).populate('role');
        next();
    } catch (err) {
        res.status(400).send({success:false, message: 'Invalid token' });
    }
};

export const authorize = (resource,action) => {
    return (req, res, next) => {
        const { role } = req.user;
        
        const permission = role.permissions.find(
            (perm) => perm.resource === resource && perm.actions.includes(action)
        );

        if (!permission) {
            return res.status(403).send({success:false, message: 'Permission denied' });
        }

        next();
    };
};
