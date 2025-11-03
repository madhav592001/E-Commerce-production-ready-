import { ApiError } from "../utils/ApiError.js";

export const rbacMiddleware = (requiredRoles=[])  => (req, res, next) => {
    if(!req.user || !req.user.roles) {
        throw new ApiError(403, 'Access denied');
    }
    const hasAccess = req.user.roles.some(role => requiredRoles.includes(role))

    if(!hasAccess) {
        return next(new ApiError(403, 'Access denied'));
    }

    next()
}