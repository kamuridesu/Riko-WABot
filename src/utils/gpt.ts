import axios from 'axios';

export interface Conversation {
    role: "system" | "user" | "assistant";
    content: string;
    images?: string[];
}

interface Details {
    parent_model: string;
    format: string;
    family: string;
    families: string[]
}

export interface Model {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: Details;
    parameter_size: string;
    quantization_level: string;
}

type EditCallback = (message: string, controller?: AbortController) => Promise<any>;
type FinishCallback = (message: string) => Promise<any>;


const GPTURL = process.env.GPT_HOST;
export let IS_GPT_ENABLED = GPTURL != undefined;

(async () => {
    try {
        const response = await axios.head(`http://${GPTURL}/`);
        IS_GPT_ENABLED = response.status === 200;
    } catch (error) {
        console.error("Error checking GPT status:", error);
        IS_GPT_ENABLED = false;
    }
})();

export class GPT {
    isGPTEnabled = IS_GPT_ENABLED

    async getModels(): Promise<Model[]> {
        const response = await axios.get(
            `http://${GPTURL}/api/tags`,
            {
                responseType: 'json'
            }
        )
        if (response.status == 200) {
            return response.data.models;
        }
        return []
    }

    async fetchStreamingMessage(model: string, messageText: string, editCallback: EditCallback, finishCallback: FinishCallback) {
        const response = await axios.post(
            `http://${GPTURL}/api/generate`,
            JSON.stringify({
                model,
                prompt: messageText
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType: "stream"
            },
        );
        let responseText = "";
        let counter = 0;
        response.data.on('data', async (data: Buffer) => {
            const jsonData = JSON.parse(data.toString());
            if (!jsonData.done) {
                responseText += jsonData.response;
                if (counter % 50 == 0) {
                    await editCallback(responseText);
                }
                counter++;
            } else {
                await finishCallback(responseText);
            }
        });
    }

    async fetchChat(model: string, conversation: Conversation[], editCallback: EditCallback, finishCallback: FinishCallback) {
        const controller = new AbortController();
        const response = await axios.post(
            `http://${GPTURL}/api/chat`,
            JSON.stringify({
                model,
                messages: conversation
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType: "stream",
                signal: controller.signal
            },
        );
        let responseText = "";
        let counter = 0;
        response.data.on('data', async (data: Buffer) => {
            const jsonData = JSON.parse(data.toString());
            if (!jsonData.done) {
                responseText += jsonData.message.content;
                await editCallback(responseText, controller);
                counter++;
                if (counter > 5096) {
                    controller.abort()
                    await finishCallback("Oopsie, parece que não consegui pensar em nada para responder");
                    return;
                }
            } else {
                await finishCallback(responseText);
            }
        });
    }
}
