import {createGPTInstance, GPT} from "../models/gpt.model";
import redisClient from "../utils/redisClient";
import {GENERATE_SYSTEM_MESSAGE} from "../utils/constants";

class GPTManager {
  async createGPT(name: string, movie: string, systemMessage: string): Promise<void> {
    const gpt = createGPTInstance(name, movie, systemMessage);
    const gptSerialized = JSON.stringify(gpt);
    await redisClient.set(name, gptSerialized)
  }

  async getGPT(name: string): Promise<GPT | null> {
    const gptSerialized = await redisClient.get(name);
    if (!gptSerialized) {
      return null;
    }
    const gptData = JSON.parse(gptSerialized) as GPT;
    return createGPTInstance(gptData.name, gptData.movie, gptData.systemMessage);
  }

  async generateSystemMessageForCharacter(movie: string, character: string): Promise<string> {
    const generateSystemMessageGPTName = 'GENERATE_SYSTEM_MESSAGE_NAME';
    const generateSystemMessageGPTMovie = 'GENERATE_SYSTEM_MESSAGE_MOVIE';
    let generateSystemMessageGPT = await this.getGPT(generateSystemMessageGPTName);
    if (!generateSystemMessageGPT) {
        await this.createGPT(generateSystemMessageGPTName, generateSystemMessageGPTMovie, GENERATE_SYSTEM_MESSAGE);
    }
    generateSystemMessageGPT = await this.getGPT(generateSystemMessageGPTName);
    if (!generateSystemMessageGPT) {
        throw new Error("Failed to create generate system message GPT instance");
    }
    return await generateSystemMessageGPT.sendMessage(`${movie}, ${character}`);
  }
}

export const gptManager = new GPTManager();
