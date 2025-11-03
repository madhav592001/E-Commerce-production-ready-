import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        }
    ],
}, {
    timestamps: true,
})

const User = model('User', userSchema)

export default User