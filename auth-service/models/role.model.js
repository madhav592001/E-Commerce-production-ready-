import {Schema, model} from 'mongoose'
import { Roles } from '../constants/roles.constants.js'

const roleSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        unique: true,
        enum: Object.values(Roles)
    },
    permissions: [
        {
            type: String, 
            required: true
        }
    ],
}, {
    timestamps: true,
})

const Role = model('Role', roleSchema)

export default Role