import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { Emojis } from "../utils/emoji.js";

export async function mentionAll(message: IMessage, args: string[]) {
    if (!message.chatIsGroup) {
        return message.replyText("Erro! Este comando pode ser usado apenas em groupos!");
    }
    if (!message.author.isAdmin) {
        return message.replyText("Erro! Apenas ADMINs podem usar este comando!");
    }
    if (args.length <= 0) {
        return message.replyText("Erro! Preciso de alguma mensagem!");
    }
    const membersIds = message.group?.members.map(member => member.id);
    await message.react(Emojis.success);
    return await message.replyText(args.join(" "), {
        mentions: membersIds
    });
}
