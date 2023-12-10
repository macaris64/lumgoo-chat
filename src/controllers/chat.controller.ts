import {NextFunction, Request, Response} from 'express';
import {APIError} from "../utils/errors";
import {gptManager} from "../managers/gpt";
import {UserThreads} from "../models/userThreads.model";
import {Message} from "../models/message.model";
import {Character} from "../models/character.model";
import {Thread} from "../models/thread.model";

export const createGPT = async (req: Request, res: Response, next: NextFunction) => {
    const { name, movie, systemMessage } = req.body;
    try {
        if (!name || !systemMessage || !movie) {
            throw new APIError(400, "Missing required parameters");
        }
        const gpt = await gptManager.getGPT(name);
        if (gpt) {
            throw new APIError(400, `GPT instance '${name}' already exists`);
        }
        await gptManager.createGPT(name, movie, systemMessage);
        res.status(201).send({});
    } catch (error) {
        next(error);
    }
}

export const conversation = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, threadId, content } = req.body;

    try {
        if (!userId || !threadId || !content) {
            throw new APIError(400, "Missing required parameters");
        }
        // Check if the user is part of the thread
        const userThread = await UserThreads.findOne({ where: { UserId: userId, ThreadId: threadId } });
        if (!userThread) {
            throw new APIError(403, "User is not a participant in the thread");
        }

        // Save the user's message to the thread
        await Message.create({ content, threadId, senderId: userId });

        // Get all characters in the thread
        const characters = await Character.findAll({
            include: [{
                model: Thread,
                where: { id: threadId }
            }]
        });

        // For each character, send the message to their GPT instance and save the response
        for (const character of characters) {
            const gpt = await gptManager.getGPT(character.name);
            console.log("GPT ", gpt)
            if (gpt) {
                const response = await gpt.sendMessage(content);
                await Message.create({ content: response, threadId, senderId: character.id });
            }
        }

        res.status(200).send('Message sent and responses recorded');
    } catch (error) {
        console.error('Error in conversation endpoint:', error);
        next(error);
    }
}
