import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { Emojis } from "../utils/emoji.js";
import { IBot } from "@kamuridesu/whatframework/@types/types.js";

enum Actions {
    demote = "demote",
    promote = "promote",
    add = "add",
    remove = "remove"
}

async function validateBotIsAdmin(message: IMessage) {
    let returnValue = true;
    if (!message.group?.botIsAdmin) {
        await message.react(Emojis.fail);
        await message.replyText("Erro! O bot precisa ser admin para usar este comando!");
        returnValue = false;
    }
    return returnValue;
}

async function validateIsGroupAndAdmin(message: IMessage) {
    let returnValue = true;
    if (!message.chatIsGroup) {
        await message.react(Emojis.fail);
        await message.replyText("Erro! Este comando pode ser usado apenas em groupos!");
        returnValue = false;
    }
    if (!message.author.isAdmin) {
        await message.react(Emojis.fail);
        await message.replyText("Erro! Apenas ADMINs podem usar este comando!");
        returnValue = false;
    }
    return returnValue;
}

export async function mentionAll(message: IMessage, args: string[]) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (args.length <= 0) {
        await message.react(Emojis.fail);
        return await message.replyText("Erro! Preciso de alguma mensagem!");
    }
    const membersIds = message.group?.members.map(member => member.id);
    await message.react(Emojis.success);
    return await message.replyText(args.join(" "), {
        mentions: membersIds
    });
}

export async function demote(message: IMessage) {
    if (! (await validateIsGroupAndAdmin(message))) return;
    if (! (await validateBotIsAdmin(message))) return;
    if (message.mentionedUsers.length < 1 && !message.hasQuotedMessage) {
        message.react(Emojis.fail);
        return await message.replyText("Erro! Preciso que algum usuário seja mencionado!");
    }

    let errorMessage = "";
    if (message.mentionedUsers.length > 0) {
        for (let user of message.mentionedUsers) {
            const demoteReturn = (await __demote(user, message));
            if (demoteReturn != undefined) {
                errorMessage += demoteReturn;
            }
        }
    }
    if (message.quotedMessage?.author) {
        let user = message.quotedMessage.author.jid;
        const demoteReturn = (await __demote(user, message));
        if (demoteReturn != undefined) {
            errorMessage += demoteReturn;
        }
    }

    if (errorMessage != "") {
        await message.react(Emojis.fail);
        return await message.replyText(errorMessage);
    }
    await message.react(Emojis.success);
}

async function __demote(user: string, message: IMessage) {
    if (!message.group?.admins.map(e => e.id).includes(user)) {
        return `\nUsuário ${user} não é admin!`;
    } else {
        await message.bot.connection?.groupParticipantsUpdate(message.author.chatJid, [user], "demote");
    }
}

export async function promote(message: IMessage) {
    if (! (await validateIsGroupAndAdmin(message))) return;
    if (! (await validateBotIsAdmin(message))) return;
    if (message.mentionedUsers.length < 1 && !message.hasQuotedMessage) {
        message.react(Emojis.fail);
        return await message.replyText("Erro! Preciso que algum usuário seja mencionado!");
    }

    let errorMessage = "";
    if (message.mentionedUsers.length > 0) {
        for (let user of message.mentionedUsers) {
            const demoteReturn = (await __promote(user, message));
            if (demoteReturn != undefined) {
                errorMessage += demoteReturn;
            }
        }
    }
    if (message.quotedMessage?.author) {
        let user = message.quotedMessage.author.jid;
        const demoteReturn = (await __promote(user, message));
        if (demoteReturn != undefined) {
            errorMessage += demoteReturn;
        }
    }

    if (errorMessage != "") {
        await message.react(Emojis.fail);
        return await message.replyText(errorMessage);
    }
    await message.react(Emojis.success);
}

async function __promote(user: string, message: IMessage) {
    if (message.group?.admins.map(e => e.id).includes(user)) {
        return `\nUsuário ${user} é admin!`;
    } else {
        await message.bot.connection?.groupParticipantsUpdate(message.author.chatJid, [user], "promote");
    }
}
