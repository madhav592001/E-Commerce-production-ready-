import { ApiError } from "../utils/ApiError.util.js"
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import {comparePassword, hashPassword} from "../utils/hashPassword.util.js";
import {sendSuccessResponse} from '../utils/responseHandler.util.js';
import {generateToken} from "../utils/auth.util.js";
import { EmailRegex } from "../constants/emailRegex.constants.js";
import { generateRefreshToken, isRefreshTokenValid, revokeRefreshToken, saveRefreshToken } from "../utils/refreshToken.util.js";


export const registerUser = async (req, res) => {

    try {

        const {email, username, password, roles=[]} = req.body;

        if(!email || !username || !password) {
            throw new ApiError(400, 'Email, username and password are required');
        }

        if(!EmailRegex.test(email)) {
            throw new ApiError(400, 'Invalid Email');
        }

        if(await User.findOne({ $or: [{ email }, { username }] }) ){
            throw new ApiError(409, 'User with given email or username already exists');
        }

        let roleDocs

        if(roles.length) { 
            roleDocs = await Role.find({ name: { $in: roles } });
            if(roleDocs.length !== roles.length) {
                throw new ApiError(400, 'One or more roles are invalid');
            }
        } else {
            roleDocs = await Role.find({ name: 'USER' });
        }

        let passwordHash = await hashPassword(password);

        const newUser = await User.create({
            email,
            username,
            passwordHash,
            roles: roleDocs.map(role => role._id)
        })

        sendSuccessResponse(res, {id: newUser._id, email: newUser.email, username: newUser.username, roles: roleDocs.map(r => r.name) }, 'User registered successfully', 201)

    }catch (error) {
        next(error);
    }

}

export const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        const user = await User.findOne({ email }).populate('roles');

        if(!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);
        if(!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const tokenPayload = {
            id: user._id,
            roles: user.roles.map(role => role.name)
        };

        const token = generateToken(tokenPayload)
        const refreshToken = generateRefreshToken()

        await saveRefreshToken(user._id, refreshToken)

        sendSuccessResponse(res, { token, refreshToken }, 'Login successful');
    }catch (error) {
        next(error);
    }
}

export const refreshToken = async ( req, res, next ) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw new ApiError(400, 'Refresh Token Required')

            const user = await User.findOne({ 'refreshTokens.token': refreshToken })
            if(!user) throw new ApiError(401, 'Invalid Refresh Token')
            
            const isValid = await isRefreshTokenValid(user._id, refreshToken)
            if(!isValid) throw new ApiError(401, 'Refresh Token Expired or invalid')
            
            const newToken = generateToken({id: user._id, roles: user.roles.map(r => r.name)})
            const newRefreshToken = generateRefreshToken()

            await revokeRefreshToken(user._id, refreshToken)
            await saveRefreshToken(user._id, newRefreshToken)

            sendSuccessResponse(res, { token: newToken, refreshToken: newRefreshToken }, 'Refresh Token Updated');
    } catch (error) {
        next(error)
    }
}

export const logout = async ( req, res, next ) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) throw new ApiError(400, 'Refresh Token Required')
        
        const user = await User.findOne({ 'refreshTokens.token': refreshToken })
        if(!user) {
            sendSuccessResponse(res, null, 'Logged Out')
            return
        }
        
        await revokeRefreshToken(user._id, refreshToken)

        sendSuccessResponse(res, null, 'Logged Out')

    } catch (error) {
        next(error)
    }
}