import express from 'express';
const router = express.Router();

import * as chatController from '../controllers/chat.controller';

router.post('/create-gpt', chatController.createGPT);
router.post('/conversation', chatController.conversation);

export default router;
