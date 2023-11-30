import {NextFunction, Request, Response} from 'express';
import {APIError} from "../utils/errors";

import {Character} from '../models/character.model';

export const createCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, movie} = req.body;
    if (!name) {
      throw new APIError(400, 'Name is required');
    }
    if (!movie) {
      throw new APIError(400, 'Movie is required');
    }
    let newCharacter;
    const existingCharacter = await Character.findOne({where: {name}});
      if (existingCharacter) {
        throw new APIError(400, 'Character already exists');
      }
      newCharacter = await Character.create({name, movie});
      res.status(201).json(newCharacter);
  } catch (error) {
    console.error('Error checking if character exists:', error);
    next(error)
    }
}

export const getCharacterById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const character = await Character.findByPk(id);
        if (!character) {
        throw new APIError(404, 'Character not found');
        }
        res.status(200).json(character);
    } catch (error) {
        console.error('Error getting character by id:', error);
        next(error)
    }
}
