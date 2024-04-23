import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { Database } from "../utils/db.js";
import { Emojis } from "../utils/emoji.js";
import { validateIsGroupAndAdmin } from "./admin.js";

export async function changePoints(message: IMessage, args: string[], db: Database, subtract = false) {
    if (!(await validateIsGroupAndAdmin(message))) return;
    if (args.length < 1) {
        await message.replyText("Erro! Faltando numero de pontos");
        return await message.react(Emojis.fail);
    }

    const chatJid = message.author.chatJid;
    let mentionedUserJid = message.quotedMessage?.author.jid;

    if (mentionedUserJid === undefined && message.mentionedUsers.length < 1) {
        await message.replyText("Preciso que um usuário seja mencionado!");
        return await message.react(Emojis.fail);
    }
    if (mentionedUserJid === undefined) {
        mentionedUserJid = message.mentionedUsers[0];
    }

    const points = args.filter(x => !x.includes("@")).join(" ").trim();

    if (!points.match(/^\d+$/)) {
        await message.replyText("Preciso que um valor seja passado!");
        return await message.react(Emojis.fail);
    }
    
    await db.addMemberToPoints(chatJid, mentionedUserJid, parseInt(points), subtract);

    return await message.react(Emojis.success);

}

export async function getAllMembersPoints(message: IMessage, db: Database) {
    const result = await db.getAllMembersPoints(message.author.chatJid);
    let resultString = "Pontuação atual: \n\n";
    for (let member of result) {
        resultString += "- " + member.jid + ": " + member.points + "\n";
    }

    await message.replyText(resultString);
    return await message.react(Emojis.success);

}
