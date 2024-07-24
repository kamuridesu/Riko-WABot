import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import { createSticker } from "@kamuridesu/whatframework/libs/sticker.js";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { unlink, writeFile } from "fs/promises";
import { FilterDB, IS_DB_ENABLED } from "../utils/db.js";
import { Emojis } from "../utils/emoji.js";
import { GPT } from "../utils/gpt.js";

const gptInstance = new GPT();

export async function makeSticker(
  bot: IBot,
  message: IMessage,
  args: string[],
) {
  await message.react(Emojis.waiting);
  let packname = "Riko's stickers collection";
  let author = "Riko Bot";

  if (args.length >= 1) {
    if (["help", "ajuda"].includes(args[0])) {
      return message.replyText(
        `Use ${bot.prefix}sticker para criar um sticker, ou !sticker pacote autor para mudar o pacote e o autor!`,
      );
    }
    if (args.length == 2) {
      packname = args[0];
      author = args[1];
    }
  }

  try {
    await createSticker(message, bot, author, packname);
    return await message.react(Emojis.success);
  } catch (e) {
    return await message.react(Emojis.fail);
  }
}

export async function nivelGado(message: IMessage) {
  let messages = [
    "ultra extreme gado",
    "Gado-Master",
    "Gado-Rei",
    "Gado",
    "Escravo-ceta",
    "Escravo-ceta Maximo",
    "Gacorno?",
    "Jogador De Forno Livre<3",
    "Mestre Do Frifai<3<3",
    "Gado-Manso",
    "Gado-Conformado",
    "Gado-Incubado",
    "Gado Deus",
    "Mestre dos Gados",
    "Topa tudo por buceta",
    "Gado Comum",
    "Mini Gadinho",
    "Gado Iniciante",
    "Gado Basico",
    "Gado Intermediario",
    "Gado Avançado",
    "Gado Profisional",
    "Gado Mestre",
    "Gado Chifrudo",
    "Corno Conformado",
    "Corno HiperChifrudo",
    "Chifrudo Deus",
    "Mestre dos Chifrudos",
  ];
  let choice = `Você é:\n\n${messages[Math.floor(Math.random() * messages.length)]}`;
  await message.replyText(choice);
  await message.react(Emojis.success);
}

export async function slot(message: IMessage) {
  // data.sender_data.slot_chances = data.sender_data.slot_chances - 1;
  const fruits_array = [
    "🥑",
    "🍉",
    "🍓",
    "🍎",
    "🍍",
    "🥝",
    "🍑",
    "🥥",
    "🍋",
    "🍐",
    "🍌",
    "🍒",
    "🔔",
    "🍊",
    "🍇",
  ];
  // const fruits_array = ['🥑', '🍉', '🍓'];
  let winner: string[] = [];
  for (let i = 0; i < 3; i++) {
    winner.push(fruits_array[Math.floor(Math.random() * fruits_array.length)]);
  }
  let _message = "Você perdeu!";
  if (
    winner[0] === winner[1] &&
    winner[1] === winner[2] &&
    winner[2] == winner[0]
  ) {
    _message = "Você ganhou!";
  }
  const slot_message = `Consiga 3 iguais para ganhar
╔═══ ≪ •❈• ≫ ════╗
║         [💰SLOT💰 | 777 ]
║
║
║           ${winner.join(" : ")}  ◄━━┛
║
║
║         [💰SLOT💰 | 777 ]
╚════ ≪ •❈• ≫ ═══╝

${_message}`;
  return message.replyText(slot_message);
}

export async function nivelGay(message: IMessage) {
  const responses = [
    "hmm... é hetero😔",
    "+/- boiola",
    "tenho minha desconfiança...😑",
    "é né?😏",
    "é ou não?🧐",
    "é gay🙈",
  ];
  const percentage = Math.round(Math.random() * 100);
  const index =
    percentage <= 10
      ? 0
      : percentage > 10 && percentage <= 20
        ? 1
        : percentage > 20 && percentage <= 30
          ? 2
          : percentage > 30 && percentage <= 40
            ? 3
            : percentage > 40 && percentage <= 50
              ? 4
              : 5;
  const response = `Você é ${percentage}% gay\n\n${responses[index]}`;
  await message.react(Emojis.success);
  return message.replyText(response);
}

export async function chanceDe(message: IMessage, args: string[]) {
  let error = "Erro desconhecido!";
  if (args.length == 0) {
    error =
      "Você precisa especificar qual a chance, ex: !chance de eu ficar off";
  } else {
    const text = args.join(" ");
    if (text.includes("virgindade") || text.includes("virgem")) {
      return await message.replyText("Nenhuma");
    }
    return await message.replyText(
      "A chance " + text + " é de " + Math.round(Math.random() * 100) + "%",
    );
  }
  await message.replyText(error);
  await message.react(Emojis.success);
}

export async function perc(message: IMessage, args: string[]) {
  let error = "Erro desconhecido!";
  if (args.length == 0) {
    error = "Você dizer o nome da porcentagem!";
  } else {
    const text = args.join(" ");
    await message.replyText(
      "Você é " + Math.round(Math.random() * 100) + "% " + text,
    );
    return await message.react(Emojis.success);
  }

  await message.replyText(error);
  await message.react(Emojis.fail);
}

export async function casal(message: IMessage, bot: IBot) {
  if (!message.chatIsGroup) {
    return message.replyText(
      "Erro! Comando pode ser usado apenas em um grupo!",
    );
  }
  const members = (await bot.connection?.groupMetadata(message.author.chatJid))
    ?.participants;
  const membersExceptBot = members?.filter(
    (value) => value.id.split("@")[0] != bot.botNumber,
  );
  if (membersExceptBot == undefined)
    return message.replyText(
      "Erro! Comando pode ser usado apenas em um grupo!",
    );

  let shuffled = [...membersExceptBot];
  for (let i = membersExceptBot.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [shuffled[i - 1], shuffled[j]] = [shuffled[j], shuffled[i - 1]];
  }

  const sliced = shuffled.slice(0, 2);

  let _message =
    "❤️❤️ Meu casal ❤️❤️\n\n" + `${sliced[0].id} + ${sliced[1].id}`;
  await message.replyText(_message);
  await message.react(Emojis.success);
}

export async function gpt(message: IMessage, args: string[]) {
  if (args == undefined)
    return message.replyText("A mensagem não pode ser vazia!");
  if (!gptInstance.isGPTEnabled)
    return message.replyText("GPT não está configurado!");
  // return await message.replyText(
  //   "GPT desativado por tempo indefinido, quando voltar mando um anuncio.",
  // );
  await message.react(Emojis.waiting);
  return gptInstance.generate(message);
}

export async function copyMedia(message: IMessage) {
  await message.react(Emojis.waiting);
  if (!["imageMessage", "videoMessage"].includes(message.quotedMessageType)) {
    await message.replyText("Mensagem não é video ou imagem!");
    return await message.react(Emojis.fail);
  }
  const messageMedia = message.hasQuotedMessage
    ? JSON.parse(
        JSON.stringify(message.originalMessage).replace("quotedM", "m"),
      ).message.extendedTextMessage.contextInfo
    : message.originalMessage;
  const mediaBuffer = await downloadMediaMessage(messageMedia, "buffer", {});
  const type: string = message.quotedMessageType.replace("Message", "");
  await message.replyMedia(mediaBuffer as any, type);
  await message.react(Emojis.success);
}

export async function registerFilter(
  message: IMessage,
  args: string[],
  db: FilterDB,
) {
  if (
    args === undefined ||
    args.length < 1 ||
    message.hasQuotedMessage == false
  ) {
    await message.replyText(
      "Por gentileza, mencione uma mensagem e responda com um filtro!",
    );
    return await message.react(Emojis.fail);
  }

  if (
    !["conversation", "imageMessage", "stickerMessage"].includes(
      message.quotedMessageType,
    )
  ) {
    await message.replyText(
      "Apenas mensagens de texto, sticker e imagens são suportadas no momento!",
    );
    return await message.react(Emojis.fail);
  }

  if (!IS_DB_ENABLED) {
    await message.replyText("Erro ao consultar banco de dados!");
    return await message.react(Emojis.fail);
  }

  await db.addChatIfNotExists(message.author.chatJid);
  const filter = args.join(" ");

  if (
    (await db.getFilters(message.author.chatJid)).filter(
      (x) => x.pattern == filter,
    ).length > 0
  ) {
    await message.replyText("Filtro já existe!");
    return await message.react(Emojis.fail);
  }

  if (message.quotedMessageType == "conversation") {
    await db.addFilterIfNotExists(
      message.author.chatJid,
      message.quotedMessageType,
      message.quotedMessage!.body,
      filter,
    );
  } else if (
    ["imageMessage", "stickerMessage"].includes(message.quotedMessageType)
  ) {
    const mediaMsg = JSON.parse(
      JSON.stringify(message.originalMessage).replace("quotedM", "m"),
    ).message.extendedTextMessage.contextInfo;
    const buffer = await downloadMediaMessage(mediaMsg, "buffer", {});
    const randomFilename = `states/filter_media/${Math.random() * 1000}.png`;
    await writeFile(randomFilename, buffer);
    await db.addFilterIfNotExists(
      message.author.chatJid,
      message.quotedMessageType,
      randomFilename,
      filter,
    );
  }

  await message.replyText("Filter criado com sucesso!");
  await message.react(Emojis.success);
}

export async function removeFilter(
  message: IMessage,
  args: string[],
  db: FilterDB,
) {
  if (!IS_DB_ENABLED) {
    await message.replyText("Erro ao consultar banco de dados!");
    return await message.react(Emojis.fail);
  }

  const strFilter = args.join(" ");

  const filter = (await db.getFilters(message.author.chatJid)).find(
    (x) => x.pattern == strFilter,
  );
  if (!(filter?.kind == "conversation")) {
    try {
      await unlink(filter!.response);
    } catch (e) {
      console.error(e);
    }
  }

  await db.deleteFilter(strFilter, message.author.chatJid);

  await message.replyText("Filtro " + strFilter + " deletado");
  await message.react(Emojis.success);
}

export async function getFilters(message: IMessage, db: FilterDB) {
  if (!IS_DB_ENABLED) {
    await message.replyText("Erro ao consultar banco de dados!");
    return await message.react(Emojis.fail);
  }

  const filters =
    "Filtros registrados no grupo: \n- " +
    (await db.getFilters(message.author.chatJid))
      .map((x) => x.pattern)
      .join("\n- ");
  await message.replyText(filters);
  return await message.react(Emojis.success);
}
