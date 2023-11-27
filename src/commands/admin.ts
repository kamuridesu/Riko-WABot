import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { Emojis } from "../utils/emoji.js";
import { IBot } from "@kamuridesu/whatframework/@types/types.js";

async function validate(message: IMessage) {
    let returnValue = true;
    if (!message.chatIsGroup) {
        message.replyText("Erro! Este comando pode ser usado apenas em groupos!");
        returnValue = false;
    }
    if (!message.author.isAdmin) {
        message.replyText("Erro! Apenas ADMINs podem usar este comando!");
        returnValue = false;
    }
    return returnValue;
}

export async function mentionAll(message: IMessage, args: string[]) {
    if (!validate(message)) return;
    if (args.length <= 0) {
        return message.replyText("Erro! Preciso de alguma mensagem!");
    }
    const membersIds = message.group?.members.map(member => member.id);
    await message.react(Emojis.success);
    return await message.replyText(args.join(" "), {
        mentions: membersIds
    });
}
