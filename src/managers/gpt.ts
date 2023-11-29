import {createGPTInstance, GPT} from "../models/gpt.model";

class GPTManager {
  private gptInstances: Map<string, GPT> = new Map();

  createGPT(name: string): void {
    const gpt = createGPTInstance(name);
    this.gptInstances.set(name, gpt);
  }

  getGPT(name: string): GPT | undefined {
    return this.gptInstances.get(name);
  }
}

export const gptManager = new GPTManager();
