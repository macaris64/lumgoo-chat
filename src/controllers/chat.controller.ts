import {NextFunction, Request, Response} from 'express';
import {APIError} from "../utils/errors";
import {gptManager} from "../managers/gpt";

export const createGPT = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    try {
        if (!name) {
            throw new APIError(400, 'Missing name parameter');
        }
        const gpt = gptManager.getGPT(name);
        if (gpt) {
            throw new APIError(400, `GPT instance '${name}' already exists`);
        }
        gptManager.createGPT(name);
        res.send(`GPT instance '${name}' created`);
    } catch (error) {
        next(error);
    }
}

export const conversation = async (req: Request, res: Response, next: NextFunction) => {
    const { participants, initialMessage } = req.body;

    try {
        let currentMessage = initialMessage;
        for (const participant of participants) {
            const gpt = gptManager.getGPT(participant);
            if (!gpt) {
                throw new APIError(404, `GPT instance '${participant}' not found`);
            }
            currentMessage = await gpt.sendMessage(currentMessage);
        }
        res.json({ finalResponse: currentMessage });
        } catch (error) {
            next(error)
        }
}
