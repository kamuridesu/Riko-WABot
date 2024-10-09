import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import * as funcs from "./chats.js";

import { Database, FilterDB } from "../utils/db.js";
import { CommandHandler } from "@kamuridesu/whatframework/libs/handlers.js";

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

async function chatsHandler(bot: IBot, message: string, context: IMessage, DATABASE: Database, FILTERDB: FilterDB, cmdHandler: CommandHandler) {
    // if (context.chatIsGroup) {
    //     if ((await context.group!.name) == "Notas") {
    //         let lastBotInteraction = await DATABASE.getLastBotInteraction(context.author.chatJid);
    //         if (lastBotInteraction == 0) {
    //             await DATABASE.bumpLastBotInteraction(context.author.chatJid);
    //             lastBotInteraction = Date.now();
    //         }
    //         const offsetInteraction = Date.now() - lastBotInteraction;

    //         if (offsetInteraction > 4320) {
    //             await context.replyText("Poxa, parece que não faço a diferença por aqui, fazem 3 dias que ninguem interage comigo. Adeus!");
    //             console.log(bot.botNumber);
    //             // await bot.connection?.groupParticipantsUpdate(context.author.chatJid, [bot.botNumber!], "remove");
    //         }
    //     }

    // }

    await DATABASE.addToMessageCount(context.author.chatJid, context.author.jid);
    const user = await DATABASE.getMember(context.author.chatJid, context.author.jid);
    if (user?.groupSilenced) {
        await bot.connection?.sendMessage(context.author.chatJid, { delete: context.originalMessage.key });
        return;
    }

    const botIsStopped = await DATABASE.getBotIsStopped(context.author.chatJid);
    if (botIsStopped) return;

    if (message.toLocaleLowerCase().split(" ").includes("bot")) {
        if (["inutil", "inútil", "lixo", "arrombado", "fdp", "ruim", "tome no rabo"]
            .filter(x => message.toLowerCase().includes(x)).length > 0) {
            return await context.replyText(OFFENSIVE_RESPONSES[Math.floor(Math.random() * OFFENSIVE_RESPONSES.length)]);
        }
        return await funcs.replyConciseMessage(context, DATABASE, cmdHandler);
    }

    if (context.quotedMessage?.author.jid === bot.botNumber) {
        return await funcs.replyConciseMessage(context, DATABASE, cmdHandler);
    }

    const filters = (await FILTERDB.getFilters(context.author.chatJid));
    if (filters.length > 0) {
        funcs.replyFilter(bot, context, filters);
    }
}

export {
    chatsHandler
};
