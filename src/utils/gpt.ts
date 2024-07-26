import { IMessage } from '@kamuridesu/whatframework/@types/types.js';
import axios from 'axios';
import { Emojis } from './emoji.js';
import { parseMessageToModelAndMessage } from './parsers.js';

interface MessageData {
    message: IMessage;
    done: boolean;
    running: boolean;
}

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

type EditCallback = (message: string) => Promise<any>;
type FinishCallback = (message: string) => Promise<any>;

const GPTURL = process.env.GPT_HOST;
export const IS_GPT_ENABLED = GPTURL != undefined;

export class GPT {
    fila: MessageData[] = [];
    maxMessage = 2;
    running = 0;
    interval: NodeJS.Timeout | undefined = undefined;
    isGPTEnabled = IS_GPT_ENABLED

    async generate(message: IMessage) {
        const messageData = {
            message,
            done: false,
            running: false
        }
        this.fila.push(messageData);
        await this.process();
    }

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

    async process() {
        if (this.interval == undefined) {
            const interval = setInterval(async () => {
                let promises: Promise<void>[] = [];
                this.fila = this.fila.filter(item => !item.done);
                if (this.fila.filter(item => item.running).length < this.maxMessage) {
                    for (let i = 0; i < this.fila.length - promises.length; i++) {
                        const item = this.fila[i];
                        if (item.running) break;
                        promises.push(this.generateTextReply(item));
                        if (i % this.maxMessage == 0) {
                            await Promise.all(promises);
                            promises = [];
                        }
                    }
                    await Promise.all(promises);
                }
                if (this.fila.length == 0) {
                    this.interval = undefined;
                    clearInterval(interval);
                }
            }, 1000);
            this.interval = interval;
        }
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
                responseType: "stream"
            },
        );
        let responseText = "";
        let counter = 0;
        response.data.on('data', async (data: Buffer) => {
            const jsonData = JSON.parse(data.toString());
            if (!jsonData.done) {
                responseText += jsonData.message.content;
                if (counter % 50 == 0) {
                    await editCallback(responseText);
                }
                counter++;
            } else {
                await finishCallback(responseText);
            }
        });
    }

    async generateTextReply(message: MessageData) {
        message.running = true;
        const { prompt, model } = parseMessageToModelAndMessage(message.message.body)
        const messageText = "Utilize 200 caracteres ou menos: " + prompt.split(' ').slice(1).join(" ").replace(/\n/gi, ". ").replace("\"", "'");
        console.log(messageText);
        try {
            const sentMessage = await message.message.replyText(" ");
            await this.fetchStreamingMessage(
                model,
                messageText,
                async (msg) => {await sentMessage!.edit(msg)},
                async (msg) => {await sentMessage!.edit(msg); await message.message.react(Emojis.success)}
            );
        } catch (e) {
            console.log(e)
            message.message.react(Emojis.fail);
            message.message.replyText("GPT falhou");
        }
        message.done = true;
        message.running = false;
    }
}


async function main() {
    const model = "llama3.1:latest";
    const gpt = new GPT();
    let t = "";
    const conversation: Conversation[] = [
        {
            content: "why is the sky blue?",
            role: "user",
        },
        {
            content: "Because I want it to be",
            role: 'assistant'
        },
        {
            content: "But why do you want it to be blue?",
            role: 'user'
        }
    ]
    await gpt.fetchChat(model,
        conversation,
        async (m) => {console.log(m)},
        async msg => {console.log(msg)}
    )
}


if (process.env.DEBUG) {
    (async () => {
        await main()
    })();
}
