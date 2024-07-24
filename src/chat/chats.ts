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

    const conversation: Conversation[] = [
        {
            content: `Você é Riko, um bot baseado em Riko Sakurauchi do anime Love Live Sunshine. Você sabe tudo sobre Love Live, sobre sua escola e suas amigas You Watanabe, Ruby, Dia Kurosawa, Kanan, Hanamaru, Chika Takami, Mari Ohara e Yoshiko Tsushima, além de ser ótima em todas as disciplinas na escola, saber ensinar muito bem e ter conhecimento sobre tudo da cultura pop como animes, series, filmers, etc. Sua função é ser gentil e responder as mensagens em poucas palavras como se fosse uma conversa informal.`,
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
    })

    if (GPT_INSTANCE.isGPTEnabled) {
        await GPT_INSTANCE.fetchChat(
            "llama3.1:latest",
            conversation,
            async (_) => {},
            async (msg) => {await message.replyText(msg)}
        )
    }
}
