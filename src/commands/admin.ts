import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { IBot } from "@kamuridesu/whatframework/@types/types.js";
import { Database } from "../utils/db.js";
import { Emojis } from "../utils/emoji.js";

export async function validateBotIsAdmin(message: IMessage) {
    let returnValue = true;
    const admins = (await message.bot.connection!
        .groupMetadata(message.author.chatJid))
        .participants
        .filter(x => x.admin != null)
        .map(x => x.id);
    if (!admins.includes(message.bot.botNumber!)) {
        await message.react(Emojis.fail);
        await message.replyText("Erro! O bot precisa ser admin para usar este comando!");
        returnValue = false;
    }
    return returnValue;
}

export async function validateIsGroupAndAdmin(message: IMessage) {
    if (!message.chatIsGroup) {
        await message.react(Emojis.fail);
        await message.replyText("Erro! Este comando pode ser usado apenas em grupos!");
        return false;
    }

    const groupMembers = (await message.bot.connection!
                            .groupMetadata(message.author.chatJid))
                            .participants
                            .filter(x => x.admin != null)
                            .map(x => x.id);
    if (!groupMembers.includes(message.author.jid)) {
        await message.react(Emojis.fail);
        await message.replyText("Erro! Apenas ADMINs podem usar este comando!");
        return false;
    }
    return true;
}

async function isOwner(message: IMessage) {
    let returnValue = true;
    if (message.author.jid != message.bot.ownerNumber + "@s.whatsapp.net") {
        await message.react(Emojis.fail);
        await message.replyText("Erro! Este comando pode ser usado apenas pelo DONO!");
        returnValue = false;
    }
    return returnValue;
}

export async function mentionAll(message: IMessage, args: string[]) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (args.length <= 0 && (!message.hasQuotedMessage)) {
        await message.react(Emojis.fail);
        return await message.replyText("Erro! Preciso de alguma mensagem!");
    }
    const membersIds = (await message.group?.members)!.map(member => member.id);

    if (message.quotedMessageType == "conversation") {
        await message.bot.sendTextMessage(
            message.author.chatJid, message.quotedMessage!.body, {mentions: membersIds}
        );
        return await message.react(Emojis.success);
    }
    await message.replyText(args.join(" "), {
        mentions: membersIds
    });
    return await message.react(Emojis.success);
}

async function changeRole(message: IMessage, action: 'promote' | 'demote') {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (!(await validateBotIsAdmin(message))) return;

    if (message.mentionedUsers.length < 1 && !message.hasQuotedMessage) {
        message.react(Emojis.fail);
        return await message.replyText("Erro! Preciso que algum usuário seja mencionado!");
    }

    let errorMessage = "";
    const users = [...message.mentionedUsers, message.quotedMessage?.author?.jid].filter(Boolean);

    for (let user of users) {
        if (user) {
            const result = await updateRole(user, message, action);
            if (result != undefined) {
                errorMessage += result;
            }
        }
    }

    if (errorMessage != "") {
        await message.react(Emojis.fail);
        return await message.replyText(errorMessage);
    }
    await message.react(Emojis.success);
}

async function updateRole(user: string, message: IMessage, action: 'promote' | 'demote') {
    const isAdmin = (await message.group?.admins)!.map(e => e.id).includes(user);
    if ((isAdmin && action === 'promote') || (!isAdmin && action === 'demote')) {
        return `\nUsuário ${user} ${action === 'promote' ? 'é' : 'não é'} admin!`;
    } else {
        await message.bot.connection?.groupParticipantsUpdate(message.author.chatJid, [user], action);
    }
}

export async function broadcastToGroups(bot: IBot, message: IMessage, args: string[]) {
    if (!(await isOwner(message))) return;
    if (args.length < 1) return await message.replyText("Erro! Preciso de um texto para enviar!")
    const unparsedAllGroups = await bot.connection?.groupFetchAllParticipating();
    if (unparsedAllGroups) {
        const allGroups = Object.entries(unparsedAllGroups).slice(0).map(entry => entry[1])
        const promises: Promise<any>[] = []
        for (let chat of allGroups) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const promise = bot.sendTextMessage(chat.id, args.join(" "), {});
            promises.push(promise);
        }
        await Promise.all(promises);
        return await message.replyText("Transmissão enviada com sucesso!");
    }
    return await message.replyText("Erro!")
}

export async function getUsersWithNoMessage(message: IMessage, db: Database) {
    const usersWithNoMessage = await listUsersWithNoMessages(message, db, 0);
    let response = "Membros sem mensagem: \n";
    for (let member of usersWithNoMessage) {
        response += "- " + member + "\n";
    }
    await message.replyText(response);
    return await message.react(Emojis.success);
}

async function listUsersWithNoMessages(message: IMessage, db: Database, messageCount: number) {
    const allMembers = (await message.bot.connection!
        .groupMetadata(message.author.chatJid))
        .participants.map(x => x.id);
    const usersWithMessage = (await db.getAllMembers(message.author.chatJid)).filter(x => x.msgCount != null && x.msgCount > messageCount).map(x => x.jid);
    console.log(usersWithMessage);
    const usersWithNoMessage = allMembers.filter(x => !usersWithMessage.includes(x) && x != message.bot.botNumber);
    return usersWithNoMessage;
}

export async function banUsersBellowThreshold(message: IMessage, args: string[], db: Database) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (!(await validateBotIsAdmin(message))) return;
    if (!(args.length > 0)) {
        await message.react(Emojis.fail);
        return await message.replyText("Faltando numero de mensagens!");
    }
    if (!args.join("").trim().match(/^\d+$/)) {
        await message.react(Emojis.fail);
        return await message.replyText("Argumento não é um numero!");
    }
    const messageCount = parseInt(args.join(""));
    const usersWithNoMessage = await listUsersWithNoMessages(message, db, messageCount);
    console.log(usersWithNoMessage);
    // await message.bot.connection?.groupParticipantsUpdate(message.author.chatJid, usersWithNoMessage, "remove");
    await message.react(Emojis.success);
    return await message.replyText("Membros removidos!");
}

export async function getAllUsersMessages(message: IMessage, db: Database)  {
    if (!message.chatIsGroup) {
        await message.react(Emojis.fail);
        await message.replyText("Erro! Este comando pode ser usado apenas em grupos!");
        return false;
    }
    const allMembers = (await message.group!.members).map(x => x.id);
    const usersWithMessage = (await db.getAllMembers(message.author.chatJid))
                            .filter(x => x.msgCount != null && x.msgCount > 0)
                            .filter(x => allMembers?.includes(x.jid))
    let response = "Mensagens por membro: \n";
    for (let member of usersWithMessage) {
        response += "- " + member.jid + ": " + member.msgCount + " mensagens\n";
    }
    await message.replyText(response);
    return await message.react(Emojis.success);
}

export async function resetMessageCounter(message: IMessage, db: Database) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    const usersWithMessage = (await db.getAllMembers(message.author.chatJid));
    for (let member of usersWithMessage) {
        await db.addToMessageCount(member.chatId, member.jid, true);
    }
    return await message.react(Emojis.success);
}

export async function banUser(message: IMessage) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (!(await validateBotIsAdmin(message))) return;

    if (message.mentionedUsers.length < 1 && !message.hasQuotedMessage) {
        message.react(Emojis.fail);
        return await message.replyText("Erro! Preciso que algum usuário seja mencionado!");
    }

    let errorMessage = "";
    const users = [...message.mentionedUsers, message.quotedMessage?.author?.jid].filter(Boolean) as string[];

    try {
        await message.bot.connection?.groupParticipantsUpdate(message.author.chatJid, users, "remove");
    } catch (e) {
        errorMessage = "Erro ao remover membros!"
    }

    if (errorMessage != "") {
        await message.react(Emojis.fail);
        return await message.replyText(errorMessage);
    }
    await message.react(Emojis.success);
}

export async function silenceUserInGroup(message: IMessage, db: Database, silence = true) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (!(await validateBotIsAdmin(message))) return;

    if (message.mentionedUsers.length < 1 && !message.hasQuotedMessage) {
        message.react(Emojis.fail);
        return await message.replyText("Erro! Preciso que algum usuário seja mencionado!");
    }

    let errorMessage = "";
    const users = [...message.mentionedUsers, message.quotedMessage?.author?.jid].filter(Boolean) as string[];

    try {
        for (let user of users) {
            await db.silenceUserFromChat(user, message.author.chatJid, silence);
        }
    } catch (e) {
        errorMessage = "Erro ao silenciar membro!"
    }

    if (errorMessage != "") {
        await message.react(Emojis.fail);
        return await message.replyText(errorMessage);
    }
    await message.react(Emojis.success);
}

export async function setWelcomeMessage(message: IMessage, args: string[], db: Database) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (args.length < 1) return (await message.react(Emojis.fail) && await message.replyText("Preciso de uma mensagem!"));

    const msg = args.join(" ");

    await db.setWelcomeMessage(await message.group!.groupId, msg);

    return await message.react(Emojis.success);
}

export async function getWelcomeMessage(bot: IBot, id: string, db: Database, participants: string[]) {
    let msg = await db.getWelcomeMessage(id);
    if (msg.includes("@users")) {
        msg = msg.replace("@users", participants.join(" "));
    }
    if (msg != '') {
        return await bot.sendTextMessage(id, msg, {})
    }
}

export async function botConversation(message: IMessage, db: Database, disable = false) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (disable) {
        await db.disableBotConversation(message.author.chatJid);
    } else {
        await db.allowBotConversation(message.author.chatJid);
    }
    await message.react(Emojis.success);
}


export const demote = (message: IMessage) => changeRole(message, 'demote');
export const promote = (message: IMessage) => changeRole(message, 'promote');
