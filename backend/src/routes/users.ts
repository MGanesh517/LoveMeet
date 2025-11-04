import express, { Request, Response } from 'express';
import User from '../models/User';
import { uploadImages } from '../services/storageService';

const router = express.Router();

// Get user by Firebase UID
router.get('/:firebaseUid', async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Create or update user
router.post('/', async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    if (!userData.firebaseUid) {
      return res.status(400).json({ error: 'firebaseUid is required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ firebaseUid: userData.firebaseUid });

    if (existingUser) {
      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { firebaseUid: userData.firebaseUid },
        { ...userData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      return res.json({
        message: 'User updated successfully',
        user: updatedUser,
      });
    } else {
      // Create new user
      const newUser = new User({
        ...userData,
        isComplete: false,
      });

      const savedUser = await newUser.save();

      return res.status(201).json({
        message: 'User created successfully',
        user: savedUser,
      });
    }
  } catch (error: any) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create/update user', details: error.message });
  }
});

// Update user
router.put('/:firebaseUid', async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user
router.delete('/:firebaseUid', async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;

    const deletedUser = await User.findOneAndDelete({ firebaseUid });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Get all users (for discovery)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { firebaseUid, limit = 20, skip = 0 } = req.query;

    // Exclude current user from results
    const query: any = {};
    if (firebaseUid) {
      query.firebaseUid = { $ne: firebaseUid };
    }

    // Only return users with complete profiles
    query.isComplete = true;

    const users = await User.find(query)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

export default router;

