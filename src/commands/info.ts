import { IBot } from "@kamuridesu/whatframework/@types/bot";
import { IMessage } from "@kamuridesu/whatframework/@types/message";

export async function start(message: IMessage) {
    await message.react("✅");
    return message.replyText("Hey! Sou um simples bot, porém ainda estou em desevolvimento!\n\nCaso queira me apoiar no Patreon: https://www.patreon.com/kamuridesu\n\nO meu template: https://github.com/kamuridesu/WhatFramework");
}

export async function bug(message: IMessage, bot: IBot, args: string[]) {
    if (!bot.ownerNumber) {
        await message.react("❌");
        return await message.replyText("Owner não configurou o número!");
    }
    if (args.length < 1) {
        await message.react("❌");
        return await message.replyText("Por favor, digite o bug que você está reportando!");
    }
    const bug = args.join(" ");
    const sender = "https://wa.me/" + message.author.jid.split("@")[0];
    await bot.sendTextMessage(bot.ownerNumber + "@s.whatsapp.net", "Bug reportado por: " + sender + " \n\n" + bug, {});
    await message.react("✅");
    return await message.replyText("Bug reportado com sucesso!");
}
