import { IMessage } from "@kamuridesu/whatframework/@types/types";
import { Emojis } from "../utils/emoji.js";

export async function validateBotIsAdmin(message: IMessage, sendMessage = true) {
    let returnValue = true;
    const admins = (await message.bot.connection!
        .groupMetadata(message.author.chatJid))
        .participants
        .filter(x => x.admin != null)
        .map(x => x.id);
    if (!admins.includes(message.bot.botNumber!)) {
        returnValue = false;
        if (sendMessage) {
            await message.react(Emojis.fail);
            await message.replyText("Erro! O bot precisa ser admin para usar este comando!");
        }
    }
    return returnValue;
}

export async function isAdmin(message: IMessage, sendMessage = true) {
    const groupMembers = (await message.bot.connection!
        .groupMetadata(message.author.chatJid))
        .participants
        .filter(x => x.admin != null)
        .map(x => x.id);
    if (!groupMembers.includes(message.author.jid)) {
        if (sendMessage) {
            await message.react(Emojis.fail);
            await message.replyText("Erro! Apenas ADMINs podem usar este comando!");
        }
        return false;
    }
    return true;
}

export async function validateIsGroupAndAdmin(message: IMessage, sendMessage = true) {
    if (!message.chatIsGroup) {
        if (sendMessage) {
            await message.react(Emojis.fail);
            await message.replyText("Erro! Este comando pode ser usado apenas em grupos!");
        }
        return false;
    }

    return await isAdmin(message, sendMessage);
}

export async function isOwner(message: IMessage, sendMessage = true) {
    let returnValue = true;
    if (message.author.jid != message.bot.ownerNumber + "@s.whatsapp.net") {
        if (sendMessage) {
            await message.react(Emojis.fail);
            await message.replyText("Erro! Este comando pode ser usado apenas pelo DONO!");
        }
        returnValue = false;
    }
    return returnValue;
}
