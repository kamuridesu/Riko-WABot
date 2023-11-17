import { IGroupData } from "@kamuridesu/whatframework/@types/groupData";
import { IMessage } from "@kamuridesu/whatframework/@types/message";

export async function mentionAll(message: IMessage, args: string[], group: IGroupData,) {
    if (!group) {
        return message.replyText("Erro! Este comando pode ser usado apenas em groupos!");
    }
    if (!group.senderIsAdmin) {
        return message.replyText("Erro! Apenas ADMINs podem usar este comando!");
    }
    if (args.length <= 0) {
        return message.replyText("Erro! Preciso de alguma mensagem!");
    }
    const membersIds = group.members.map(member => member.id);
    return await message.replyText(args.join(" "), {
        mentions: membersIds
    });
}