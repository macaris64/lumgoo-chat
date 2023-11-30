import {NextFunction, Request, Response} from 'express';
import {APIError} from "../utils/errors";

import {Thread} from "../models/thread.model";
import {isParticipantUser, User} from "../models/user.model";
import {Character} from "../models/character.model";
import {UserThreads} from "../models/userThreads.model";
import {CharacterThreads} from "../models/characterThreads.model";

export const createThread = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, username} = req.body;
        if (!title) {
            throw new APIError(400, 'Title is required');
        }
        let user;
        if (username) {
            user = await User.findOne({where: {username: username}});
        }
        if (!user) {
            const newUsername = username || `User_${Math.random().toString(36).substring(2, 15)}`;
            user = await User.create({ username: newUsername });
        }

        const newThread = await Thread.create({title});
        await UserThreads.create({ UserId: user.id, ThreadId: newThread.id });
        res.status(201).json({ thread: newThread, user: user });
    } catch (error) {
        console.log("Failed to create thread ", error);
        next(error);
    }
}

export const getAllThreads = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const threads = await Thread.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                    through: { attributes: [] }
                },
                {
                    model: Character,
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json(threads);
    } catch (error) {
        console.log("Failed to get all threads ", error);
        next(error);
    }
};

export const getThreadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thread = await Thread.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] },
        },
        {
          model: Character,
          as: 'Characters',
          through: { attributes: [] },
        },
      ],
    });
    if (!thread) {
      throw new APIError(404, 'Thread not found');
    }
    res.json(thread);
  } catch (error) {
    next(error)
  }
};

export const updateThread = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const {title} = req.body;
        const thread = await Thread.findByPk(id);
        if (!thread) {
            throw new APIError(404, 'Thread not found');
        }
        if (title) {
            thread.title = title;
        }
        await thread.save();
        res.status(200).json(thread);
    } catch (error) {
        console.log("Failed to update thread ", error);
        next(error);
    }
}

export const deleteThread = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const thread = await Thread.findByPk(id);
        if (!thread) {
            throw new APIError(404, 'Thread not found');
        }
        await thread.destroy();
        res.status(200).json({message: 'Thread deleted successfully'});
    } catch (error) {
        console.log("Failed to delete thread ", error);
        next(error);
    }
}

export const getThreadParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thread = await Thread.findByPk(req.params.id, {
      include: [User, Character]
    });
    if (!thread) {
      throw new APIError(404, 'Thread not found');
    }
    res.json(thread);
  } catch (error) {
    next(error)
  }
};

export const updateThreadParticipants = async (req: Request, res: Response, next: NextFunction) => {
    const { userIds, characterIds } = req.body; // IDs of users and characters to add
    const ThreadId = req.params.id;

    try {
        const thread = await Thread.findByPk(ThreadId);
        if (!thread) {
            throw new APIError(404, 'Thread not found');
        }
        if (userIds && userIds.length) {
            for (const UserId of userIds) {
                const user = await User.findByPk(UserId);
                if (!user) {
                    throw new APIError(404, 'User not found');
                }
                const userThread = await UserThreads.findOne({ where: { UserId, ThreadId } });
                if (userThread) {
                    continue;
                }
                await UserThreads.create({ UserId, ThreadId });
            }
        }

        // Add Characters to Thread
        if (characterIds && characterIds.length) {
            for (const CharacterId of characterIds) {
                const character = await Character.findByPk(CharacterId);
                if (!character) {
                    throw new APIError(404, 'Character not found');
                }
                const characterThread = await CharacterThreads.findOne({ where: { CharacterId, ThreadId } });
                if (characterThread) {
                    continue;
                }
                await CharacterThreads.create({ CharacterId, ThreadId });
            }
        }
    res.status(200).send();
  } catch (error) {
    console.error('Failed to update thread participants:', error);
    next(error);
  }
};

export const removeThreadParticipant = async (req: Request, res: Response, next: NextFunction) => {
  const { participantId } = req.body; // ID of user or character to remove
  const threadId = req.params.id;

  try {
    // Assuming you have a method to determine if the participant is a User or Character
    const isUser = await isParticipantUser(participantId); // Implement this based on your logic

    if (isUser) {
      await UserThreads.destroy({ where: { userId: participantId, threadId } });
    } else {
      await CharacterThreads.destroy({ where: { characterId: participantId, threadId } });
    }

    res.send('Participant removed successfully');
  } catch (error) {
    console.error('Failed to remove thread participant:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getUserThreads = async (req: Request, res: Response, next: NextFunction) => {
    const UserId = req.params.userId;

    try {
        if (!UserId) {
            throw new APIError(400, 'User ID is required');
        }
        const userThreads = await UserThreads.findAll({
            where: { UserId },
            include: [{
                model: Thread,
                required: true
            }]
        });

        // Extract thread details from userThreads
        const threads = userThreads.map(ut => ut.ThreadId);

        res.status(200).json(threads);
    } catch (error) {
        console.error('Failed to get user threads', error);
        next(error);
    }
}