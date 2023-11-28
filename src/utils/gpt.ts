import { IMessage } from '@kamuridesu/whatframework/@types/types.js';
import axios from 'axios';
import { Emojis } from './emoji.js';

interface MessageData {
    message: IMessage;
    done: boolean;
    running: boolean;
}

const gptURL = process.env.GPT_HOST ? process.env.GPT_HOST : "localhost:11434"

export class GPT {
    fila: MessageData[] = [];
    maxMessage = 2;
    running = 0;
    interval: NodeJS.Timeout | undefined = undefined;

    async generate(message: IMessage) {
        const messageData = {
            message,
            done: false,
            running: false
        }
        this.fila.push(messageData);
        await this.process();
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

    async generateTextReply(message: MessageData) {
        message.running = true;
        const messageText = message.message.body.split(' ').slice(1).join(" ").replace(/\n/gi, ". ");
        try {
            const response = await axios.post(
                `http://${gptURL}/api/generate`,
                `{\n  "model": "chatbot",\n  "prompt":"${messageText}"\n }`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            const sentMessage = await message.message.replyText(" ");
            let responseText = "";
            let counter = 0;
            for (let line of response.data.split("\n")) {
                line = line.trim();
                if (line) {
                    const responseJSON = JSON.parse(line);
                    if (responseJSON.response != undefined) {
                        responseText += JSON.parse(line).response;
                    }
                    if (counter % 50 == 0) {
                        await sentMessage?.edit(responseText);
                    }
                }
                counter++;
            }
            await sentMessage?.edit(responseText);
            message.message.react(Emojis.success);
        } catch (e) {
            message.message.react(Emojis.fail);
            message.message.replyText("Erro!");
        }
        message.done = true;
        message.running = false;
    }
}
