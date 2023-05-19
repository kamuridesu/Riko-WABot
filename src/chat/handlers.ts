import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import * as funcs from "./chats.js";

import { Database, FilterDB } from "../utils/db.js";

const OFFENSIVE_RESPONSES = [
    "Sua mãe",
    "Vsf otario",
    "Mama aqui arrombado",
    "Ah vai dar meia hora de cu",
    "E dai",
    "Perguntei?",
    "Sei q tu quer me dar",
    "Quando eu te comi tu tava manso ne",
    "Vc",
    "Seu rabo"
]

async function chatsHandler(bot: IBot, message: string, context: IMessage, DATABASE: Database, FILTERDB: FilterDB) {
    await DATABASE.addToMessageCount(context.author.chatJid, context.author.jid);
    const user = await DATABASE.getMember(context.author.chatJid, context.author.jid);
    if (user?.groupSilenced) {
        await bot.connection?.sendMessage(context.author.chatJid, {delete: context.originalMessage.key});
        return;
    }
    const filters = (await FILTERDB.getFilters(context.author.chatJid));
    if (filters.length > 0) {
        funcs.replyFilter(bot, context, filters);
    }

    if (message.toLocaleLowerCase().includes("bot") && 
        ["inutil", "inútil", "lixo", "arrombado", "fdp", "ruim", "tome no rabo"]
        .filter(x => message.toLowerCase().includes(x)).length > 0) {
        return await context.replyText(OFFENSIVE_RESPONSES[Math.floor(Math.random() * OFFENSIVE_RESPONSES.length)]);
    }
}

export {
    chatsHandler
};
