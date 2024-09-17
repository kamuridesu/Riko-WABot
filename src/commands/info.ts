import { IBot } from "@kamuridesu/whatframework/@types/bot";
import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { Emojis } from "../utils/emoji.js";

export async function start(message: IMessage) {
    await message.react(Emojis.success);
    return message.replyText("Hey! Sou um simples bot, porém ainda estou em desevolvimento!\n\nCaso queira me apoiar no Patreon: https://www.patreon.com/kamuridesu\n\nO meu template: https://github.com/kamuridesu/WhatFramework");
}

export async function bug(message: IMessage, bot: IBot, args: string[]) {
    if (!bot.ownerNumber) {
        await message.react(Emojis.fail);
        return await message.replyText("Owner não configurou o número!");
    }
    if (args.length < 1) {
        await message.react(Emojis.fail);
        return await message.replyText("Por favor, digite o bug que você está reportando!");
    }
    let groupName = "";
    if (message.chatIsGroup) {
        groupName = await message.group!.name
    }
    const bug = args.join(" ");
    const sender = "https://wa.me/" + message.author.jid.split("@")[0];

    const msg = `Bug reportado por ${sender}` + (groupName != "" ? ` no grupo ${groupName}` : "") + `\n\n${bug}`

    await bot.sendTextMessage(bot.ownerNumber + "@s.whatsapp.net", msg, {});
    await message.react(Emojis.success);
    return await message.replyText("Bug reportado com sucesso!");
}

export async function test(bot: IBot, message: IMessage) {
    await bot.createPoll(message, "test", ["1", "2"]);
}

export async function donate(message: IMessage) {
    const paymentMethods: string[] = [
        "- Patreon: https://www.patreon.com/kamuridesu",
    ];
    if (process.env.OWNER_PIX) {
        paymentMethods.push(`- PIX: ${process.env.OWNER_PIX}`);
    }
    const messageToSend = `Caso queira ajudar financeiramente:\n\n` + paymentMethods.join("\n")
    await message.replyText(messageToSend);
}
