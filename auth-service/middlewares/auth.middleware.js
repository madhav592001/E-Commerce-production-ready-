import { verifyToken } from "../utils/auth.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        console.log(req.headers)
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Authorization header missing or malformed');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.id).populate('roles');
        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        req.user = {
            id: user._id,
            email: user.email,
            username: user.username,
            roles: user.roles.map(role => role.name)
        };

        next()
    }catch (error) {
        return next(error.statusCode ? error : new ApiError(401, 'Unauthorized'));
    }
}