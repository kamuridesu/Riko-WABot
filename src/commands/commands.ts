import { CommandHandler } from '@kamuridesu/whatframework/libs/handlers.js';
import * as info from "./info.js";
import * as media from "./media.js"
import * as diversao from "./fun.js";
import { IBot, IChatMetadata, IGroupData, IMessage } from '@kamuridesu/whatframework/@types/types.js';
import { ICommands } from '@kamuridesu/whatframework/@types/commands.js';

export function registerCommands(handler: CommandHandler) {
    const infoCommands: ICommands = {
        category: "INFO",
        commands: [
            {
                name: "start",
                description: "Mensagem de Boas Vindas",
                aliases: [],
                func: (_: IBot, message: IMessage) => {info.start(message)}
            },
            {
                name: "ajuda",
                description: "Menu de comandos. Envie um comando para saber mais sobre o mesmo, ex: $prefix$command $command",
                aliases: ["menu", "cmd", "help"],
                func: (bot: IBot, message: IMessage, args: string[]) => {message.replyText(handler.getHelp(bot, args.join(" ")), {})}
            },
            {
                name: "test",
                description: "teste",
                aliases: [],
                func: (_, message: IMessage) => {message.replyText("testando 1 2 3", {})}
            },
            {
                name: "bug",
                description: "",
                aliases: [],
                func: (bot: IBot, message: IMessage, args: string[], _: IGroupData, chat: IChatMetadata) => {info.bug(message, bot, chat, args)}
            },
            {
                name: "reply",
                description: "Test Chat",
                aliases: [],
                func: async (_: IBot, message: IMessage) => {
                    const sentMessage = await message.replyText("Oi", {});
                    const otherMessage = await sentMessage?.replyText("Estou me respondendo", {})
                }
            }
        ]
    }

    const mediaCommands = {
        category: "MIDIA",
        commands: [
            {
                name: "music",
                description: "Envia uma musica a partir de um link ou nome",
                aliases: ["música", "music"],
                func: (_: IBot, message: IMessage, args: string[]) => {media.download(message, args, "audio")}
            },
            {
                name: "video",
                description: "Envia um video a partir de um link ou nome",
                aliases: ["vid"],
                func: (_: IBot, message: IMessage, args: string[]) => {media.download(message, args)}
            },
            {
                name: "letra",
                description: "Pesquisa a letra de uma música",
                aliases: ["lyrics"],
                func: (_: IBot, message: IMessage, args: string[]) => {media.getLyrics(message, args)}
            },
            {
                name: "thumbnail",
                description: "Baixa e envia uma thumbnail de um video no youtube",
                aliases: ["vid"],
                func: (_: IBot, message: IMessage, args: string[]) => {media.thumbnail(message, args)}
            },
        ]
    }
    
    const funCommands = {
        category: "DIVERSAO",
        commands: [
            {
                name: "sticker",
                description: "Converte mídia em figurinhas",
                aliases: ["s", "fig"],
                func: (bot: IBot, message: IMessage, args: string[]) => {diversao.makeSticker(bot, message, args)}
            },
            {
                name: "slot",
                description: "Slot machine",
                aliases: [],
                func: (bot: IBot, message: IMessage) => {diversao.slot(message)}
            },
            {
                name: "chance",
                description: "Chance de..., exemplo: $prefixchance de eu ganhar 1 real",
                aliases: [],
                func: (bot: IBot, message: IMessage, args: string[]) => {diversao.chanceDe(message, args)}
            },
            {
                name: "perc",
                description: "Você é % ..., exemplo: $prefixperc gay",
                aliases: [],
                func: (bot: IBot, message: IMessage, args: string[]) => {diversao.perc(message, args)}
            },
            {
                name: "gay",
                description: "O quanto vc é gay",
                aliases: [],
                func: (bot: IBot, message: IMessage, args: string[]) => {diversao.nivelGay(message)}
            },
            {
                name: "gado",
                description: "O quanto vc é gado",
                aliases: [],
                func: (bot: IBot, message: IMessage, args: string[]) => {diversao.nivelGado(message)}
            },
            {
                name: "casal",
                description: "Escolhe um casal aleatorio",
                aliases: [],
                func: (bot: IBot, message: IMessage, _: string[], group: IGroupData) => {diversao.casal(message, bot, group)}
            },
            {
                name: "gpt",
                description: "Gera um texto",
                aliases: ["prompt"],
                func: (_: IBot, message: IMessage, args: string[]) => {diversao.gpt(message, args)}
            },
        ]
    }

    handler.register(infoCommands, funCommands, mediaCommands);
}
