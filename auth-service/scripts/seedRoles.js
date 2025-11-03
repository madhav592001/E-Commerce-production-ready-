import mongoose from "mongoose"
import dotenv from "dotenv"
import Role from "../models/role.model.js"
import { Roles } from "../constants/roles.constants.js"

//? script    ->    node -r dotenv/config  --experimental-modules scripts/seedRoles.js

dotenv.config({
    path: '../.env'
})

const preDefinedRoles = [
    {
        name: Roles.SUPERADMIN,
        permissions: ['manage_users', 'manage_roles', 'view_reports', 'all_access']
    },
    {
        name: Roles.ADMIN,
        permissions: ['manage_products', 'manage_orders', 'view_reports']
    },
    {
        name: Roles.USER,
        permissions: ["view_products", "create_orders"]
    }
]

const seedRoles = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to mongoDB')
        for (const roleData of preDefinedRoles) {
            const exists = await Role.findOne({ name: roleData.name })
            if(!exists) {
                await Role.create(roleData)
                console.log(`Role ${roleData.name} created`)
            } else {
                console.log(`Role ${roleData.name} already exits`)
            }
        }
        console.log(`Role Seeding Completed`)
        process.exit(0)
    } catch (error) {
        console.error('Error Seeding roles: ',error)
        process.exit(1)
    }
}

seedRoles()