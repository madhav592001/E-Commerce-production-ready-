import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { sendSuccessResponse } from "../utils/responseHandler.util.js";

export const getProfile = async ( req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash").populate('roles', 'name permissions')
        if(!user) {
            throw new ApiError(404, "User Not found")
        }

        sendSuccessResponse(res, user, 'User profile fetched')
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const {email, username} = req.body

        if(!email && !username) {
            throw new ApiError(400, "No Fields to update")
        }

        const updates = {}

        if (email) {
            if(await User.findOne({ email, _id: { $ne: req.user.id } })) {
                throw new ApiError(409, 'Email already in use!')
            }
            updates.email = email
        }
        if (username) {
            if(await User.findOne({ email, _id: { $ne: req.user.id } })) {
                throw new ApiError(409, 'Email already in use!')
            }
            updates.username = username
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {new: true}).select("-passwordHash").populate('roles', 'name permissions')

        if(!updatedUser) throw new ApiError(404, 'User not found')

        sendSuccessResponse(res, updatedUser, 'Profile Updated')
    } catch (error) {
        next(error)
    }
}