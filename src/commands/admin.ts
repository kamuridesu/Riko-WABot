import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { Emojis } from "../utils/emoji.js";
import { IBot } from "@kamuridesu/whatframework/@types/types.js";
import { Database } from "../utils/db.js";

export async function validateBotIsAdmin(message: IMessage) {
    let returnValue = true;
    if (!message.group?.botIsAdmin) {
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

    const groupMembers = (await message.bot.connection!.groupMetadata(message.author.chatJid))
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
    const membersIds = message.group?.members.map(member => member.id);
    if (message.quotedMessage) {
        await message.bot.sendTextMessage(
            message.author.chatJid, message.quotedMessage.body, {mentions: membersIds}
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
    const isAdmin = message.group?.admins.map(e => e.id).includes(user);
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
    const allMembers = (await message.bot.connection!
                        .groupMetadata(message.author.chatJid))
                        .participants.map(x => x.id);
    const usersWithMessage = (await db.getAllMembers(message.author.chatJid)).filter(x => x.msgCount != 0).map(x => x.jid);
    const usersWithNoMessage = allMembers.filter(x => !usersWithMessage.includes(x));
    let response = "Membros sem mensagem: \n";
    for (let member of usersWithNoMessage) {
        response += "- " + member + "\n";
    }
    await message.replyText(response);
    return await message.react(Emojis.success);
}

export async function getAllUsersMessages(message: IMessage, db: Database)  {
    const usersWithMessage = (await db.getAllMembers(message.author.chatJid)).filter(x => x.msgCount != 0 && x.msgCount != null);
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

export const demote = (message: IMessage) => changeRole(message, 'demote');
export const promote = (message: IMessage) => changeRole(message, 'promote');
