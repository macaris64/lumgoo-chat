import {NextFunction, Request, Response} from 'express';
import {APIError} from "../utils/errors";
import {gptManager} from "../managers/gpt";

export const createGPT = async (req: Request, res: Response, next: NextFunction) => {
    const { name, systemMessage } = req.body;
    try {
        if (!name || !systemMessage) {
            throw new APIError(400, "Missing required parameters");
        }
        const gpt = await gptManager.getGPT(name);
        if (gpt) {
            throw new APIError(400, `GPT instance '${name}' already exists`);
        }
        await gptManager.createGPT(name, systemMessage);
        res.status(201).send({});
    } catch (error) {
        next(error);
    }
}

export const conversation = async (req: Request, res: Response, next: NextFunction) => {
    const { participant, initialMessage } = req.body;

    try {
        if (!participant || !initialMessage) {
            throw new APIError(400, "Missing required parameters");
        }
        const gpt = await gptManager.getGPT(participant);
        if (!gpt) {
            throw new APIError(404, `GPT instance '${participant}' not found`);
        }
        try {
            const response = await gpt.sendMessage(initialMessage);
            res.json({finalResponse: response});
        } catch (error) {
            console.log(error)
            throw new APIError(500, "Failed to call OpenAI");
        }
    } catch (error) {
        next(error);
    }
}
