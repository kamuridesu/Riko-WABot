import { IBot } from "@kamuridesu/whatframework/@types/bot";
import { IChatMetadata } from "@kamuridesu/whatframework/@types/chatMetadata";
import { IMessage } from "@kamuridesu/whatframework/@types/message";

export async function start(message: IMessage) {
    return message.replyText("Hey! Sou um simples bot, porém ainda estou em desevolvimento!\n\nCaso queira me apoiar no Patreon: https://www.patreon.com/kamuridesu\n\nO meu template: https://github.com/kamuridesu/WhatFramework");
}

export async function bug(message: IMessage, bot: IBot, chat: IChatMetadata, args: string[]) {
    if (args.length < 1) {
        return await message.replyText("Por favor, digite o bug que você está reportando!");
    }
    const bug = args.join(" ");
    const sender = "https://wa.me/" + chat.messageSender.split("@")[0];
    await bot.sendTextMessage(bot.ownerNumber + "@s.whatsapp.net", "Bug reportado por: " + sender + " \n\n" + bug, {});
    return await message.replyText("Bug reportado com sucesso! O abuso desse comando pode ser punido!");
}
