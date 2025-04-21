import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import cors from 'cors';
const app = express();

import userRouter from './routes/user.route.js';
import orderRouter from './routes/order.route.js';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true,
}));

app.use('/api/auth', userRouter);
app.use('/api/orders', orderRouter);

app.listen(3000, async () => {
    console.log("Server is listening on port 3000");
    await connectDB();
})
