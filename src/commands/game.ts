import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { Database, PointsDB } from "../utils/db.js";
import { Emojis } from "../utils/emoji.js";
import { validateIsGroupAndAdmin } from "./admin.js";

export async function changePoints(
  message: IMessage,
  args: string[],
  db: PointsDB,
  subtract = false,
) {
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

  const points = args
    .filter((x) => !x.includes("@"))
    .join(" ")
    .trim();

  if (!points.match(/^\d+$/)) {
    await message.replyText("Preciso que um valor seja passado!");
    return await message.react(Emojis.fail);
  }

  await db.addMemberToPoints(
    chatJid,
    mentionedUserJid,
    parseInt(points),
    subtract,
  );

  return await message.react(Emojis.success);
}

export async function getAllMembers(message: IMessage, db: Database) {
  const result = (await db.getAllMembers(message.author.chatJid)).filter(
    (x) => x.points != 0,
  );
  let resultString = "Pontuação atual: \n\n";
  for (let member of result) {
    resultString += "- " + member.jid + ": " + member.points + "\n";
  }

  await message.replyText(resultString);
  return await message.react(Emojis.success);
}

export async function rollDice(message: IMessage, args: string[]) {
  if (args.length < 1) {
    await message.replyText("Erro! Tipo de dado não informado!");
    return await message.react(Emojis.fail);
  }
  let faces = parseInt(args[0]);
  let rolls = 1;

  if (!args.join("").trim().match(/^\d+$/)) {
    await message.replyText("Erro! Apenas números são suportados!");
    return await message.react(Emojis.fail);
  }

  if (args.length == 2) {
    rolls = parseInt(args[1]);
  }

  let results = "Resultados: \n";

  for (let i = 0; i < rolls; i++) {
    results += "- " + (Math.floor(Math.random() * faces) + 1) + "\n";
  }

  await message.replyText(results);
  return await message.react(Emojis.success);
}

export async function resetPointsCounter(message: IMessage, db: PointsDB) {
  if (!(await validateIsGroupAndAdmin(message))) return;
  const usersWithMessage = await db.getAllMembers(message.author.chatJid);
  for (let member of usersWithMessage) {
    await db.addMemberToPoints(member.chatId, member.jid, member.points, true);
  }
  return await message.react(Emojis.success);
}
