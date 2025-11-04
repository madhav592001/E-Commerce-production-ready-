import crypto from 'crypto'
import User from '../models/user.model.js'

const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN

export const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex')
}

export const saveRefreshToken = async (userId, refreshToken) => {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + REFRESH_TOKEN_EXPIRES_IN)
    await User.findByIdAndUpdate(userId, {
        $push: {
            refreshTokens: {
                token: refreshToken,
                expiresAt: expiryDate
            }
        }
    })
}

export const isRefreshTokenValid = async ( userId, refreshToken ) => {
    const user = await User.findOne({
        _id: userId,
        'refreshTokens.token': refreshToken,
        'refreshTokens.expiresAt': { $gt: new Date() }
    })
    return !!user
}

export const revokeRefreshToken = async (userId, token) => {
    await User.findByIdAndUpdate(userId, {
        $pull: {
            refreshTokens: { token }
        }
    })
}