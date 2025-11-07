import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.router.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import userRouter from './routes/user.routes.js'

dotenv.config();

const app = express();

//! Middlewares
app.use(express.json());
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter )

app.use(errorHandler);

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Auth service running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}

startServer();