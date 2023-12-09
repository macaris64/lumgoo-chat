import {OpenAI} from 'openai';
import {APIError} from "../utils/errors";
import {GPT_MODEL_4} from "../utils/constants";

export interface GPT {
    name: string;
    movie: string;
    systemMessage: string;
    sendMessage(message: string): Promise<string>;
}

export function createGPTInstance(instanceName: string, instanceMovie: string, instanceSystemMessage: string): GPT {
    // Implementation to create a new GPT instance with the given name.
    // This could involve setting up specific model parameters or API endpoints.
    const openaiApi = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

    return <GPT>new class implements GPT {
        name: string = instanceName;
        movie: string = instanceMovie;
        systemMessage: string = instanceSystemMessage;
        async sendMessage(message: string): Promise<string> {
            console.log("Your message", message)
            console.log("System message", this.systemMessage)
            let response = null;
            try {
                response = await openaiApi.chat.completions.create({
                    messages: [
                        { role: "system", content: this.systemMessage },
                        { role: "user", content: message }
                    ],
                    model: GPT_MODEL_4,
                    response_format: {"type": "text"},
                    max_tokens: 3000,
                });
            } catch (error) {
                throw new APIError(400, "Failed to call OpenAI");
            }
            try {
                if (response &&
                    response.choices &&
                    response.choices.length > 0 &&
                    response.choices[0].message &&
                    response.choices[0].message.content
                ) {
                    return response.choices[0].message.content;
                }
            } catch (error) {
                throw new APIError(500, "Invalid response format from OpenAI");
            }
            throw new APIError(500, "Invalid response from OpenAI");
        }
    }
}
