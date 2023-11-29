import {createGPTInstance, GPT} from "../models/gpt.model";
import redisClient from "../utils/redisClient";

class GPTManager {
  async createGPT(name: string, systemMessage: string): Promise<void> {
    const gpt = createGPTInstance(name, systemMessage);
    const gptSerialized = JSON.stringify(gpt);
    await redisClient.set(name, gptSerialized)
  }

  async getGPT(name: string): Promise<GPT | null> {
    const gptSerialized = await redisClient.get(name);
    if (!gptSerialized) {
      return null;
    }
    const gptData = JSON.parse(gptSerialized) as GPT;
    return createGPTInstance(gptData.name, gptData.systemMessage);
  }
}

export const gptManager = new GPTManager();
