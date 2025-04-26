import express from 'express';
import {
    signUpUser,
    loginUser,
    logoutUser,
    refreshTokens,
    getUserProfile,
} from '../controllers/user.controller.js';
import { checkAuth } from '../middlewares/user.middleware.js';
import { isAdmin } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';

const userRouter = express.Router();

userRouter.post('/signup', signUpUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/refresh-token', refreshTokens);
userRouter.get('/profile', checkAuth, getUserProfile);

// Get all users (admin only)
userRouter.get('/users', checkAuth, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('orders');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get user details (admin only)
userRouter.get('/users/:id', checkAuth, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('orders');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// Delete user (admin only)
userRouter.delete('/users/:id',checkAuth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Update user role (admin only)
userRouter.patch('/users/:id/role', checkAuth, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});

export default userRouter;
