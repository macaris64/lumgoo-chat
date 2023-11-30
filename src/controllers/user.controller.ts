import { Request, Response, NextFunction } from 'express';
import {User} from '../models/user.model';
import { APIError } from '../utils/errors';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, ...otherDetails } = req.body;

        if (!username) {
            throw new APIError(400, 'Username is required');
        }

        // Optional: Add additional validations for username or other details

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new APIError(400, 'Username already exists');
        }

        // Create new user
        const newUser = await User.create({ username, ...otherDetails });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Failed to create user', error);
        next(error);
    }
};
