export interface GPT {
  sendMessage(message: string): Promise<string>;
}

export function createGPTInstance(name: string): GPT {
  // Implementation to create a new GPT instance with the given name.
  // This could involve setting up specific model parameters or API endpoints.
    return new class implements GPT {
        sendMessage(message: string): Promise<string> {
            return Promise.resolve("Response from ${name}: [Processed '${message}']");
        }
    }
}
