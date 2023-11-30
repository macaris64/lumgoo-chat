import express from 'express';
const router = express.Router();

import * as threadController from '../controllers/thread.controller';

router.post('/threads', threadController.createThread);
router.get('/threads', threadController.getAllThreads);
router.get('/threads/:id', threadController.getThreadById);
router.put('/threads/:id', threadController.updateThread);
router.delete('/threads/:id', threadController.deleteThread);

router.get('/threads/:id/participants', threadController.getThreadParticipants);
router.put('/threads/:id/participants', threadController.updateThreadParticipants);
router.delete('/threads/:id/participants', threadController.removeThreadParticipant);

export default router;
