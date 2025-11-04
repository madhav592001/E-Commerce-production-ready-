import { ApiError } from "../utils/ApiError.util.js";

export const rbacMiddleware = (requiredRoles=[])  => (req, res, next) => {
    if(!req.user || !req.user.roles) {
        throw new ApiError(403, 'Access Denied due to roles mismatch');
    }
    const hasAccess = req.user.roles.some(role => requiredRoles.includes(role))

    if(!hasAccess) {
        return next(new ApiError(403, 'Access denied'));
    }

    next()
}