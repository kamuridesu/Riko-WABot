import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types";
import { Database, Filter } from "../utils/db.js";
import { readFile } from "fs/promises";
import { GPT, Conversation } from "../utils/gpt.js";

const GPT_INSTANCE = new GPT();


export async function replyFilter(bot: IBot, message: IMessage, filters: Filter[]) {
    for (let filter of filters) {
        if (message.body.includes(filter.pattern)) {
            if (filter.kind == "conversation") return await bot.replyText(message, filter.response, {});
            if (filter.kind == "stickerMessage") {
                const media = await readFile(filter.response);
                return await bot.replyMedia(message, media as any, "sticker");
            }
            if (filter.kind == "imageMessage") {
                const media = await readFile(filter.response);
                return await bot.replyMedia(message, media as any, "image", "image/png");
            }
        }
    }
}

export async function replyConciseMessage(message: IMessage, db: Database) {
    const prompt = message.body;
    if (message.chatIsGroup && !(await db.getBotConversation(message.author.chatJid))) {
        return;
    }

    const aiInfo = await db.getAiInfo(message.author.chatJid);

    const conversation: Conversation[] = [
        {
            content: aiInfo.systemPrompt,
            role: "system"
        }
    ];

    if (message.hasQuotedMessage) {
        if (message.quotedMessage!.author.jid === message.bot.botNumber) {
            conversation.push({
                content: message.quotedMessage!.body,
                role: "assistant"
            });
        }
    }

    conversation.push({
        content: prompt,
        role: "user"
    });

    if (GPT_INSTANCE.isGPTEnabled) {
        await GPT_INSTANCE.fetchChat(
            aiInfo.model,
            conversation,
            async (_) => {},
            async (msg) => {await message.replyText(msg)}
        )
    }
}
