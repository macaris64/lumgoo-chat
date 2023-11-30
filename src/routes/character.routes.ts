import express from 'express';
const router = express.Router();

import * as characterController from '../controllers/character.controller';

router.post('/characters', characterController.createCharacter);
router.get('/characters/:id', characterController.getCharacterById);

export default router;