import express from 'express';
const router = express.Router();

import * as userController from '../controllers/user.controller';
import * as threadController from '../controllers/thread.controller';

router.post('/users', userController.createUser);

router.get('/users/:userId/threads', threadController.getUserThreads);

export default router;
