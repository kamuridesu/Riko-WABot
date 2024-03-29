import { CommandHandler } from '@kamuridesu/whatframework/libs/handlers.js';
import { IBot, IMessage, ICommands } from '@kamuridesu/whatframework/@types/types.js';
import * as info from "./info.js";
import * as media from "./media.js"
import * as diversao from "./fun.js";
import * as admin from "./admin.js";

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
                name: "bug",
                description: "",
                aliases: [],
                func: (bot: IBot, message: IMessage, args: string[]) => {info.bug(message, bot, args)}
            },
            {
                name: "donate",
                description: "Quer ajudar o bot? Doe por aqui!",
                aliases: ["doar"],
                func: async (_, message) => {info.donate(message)}
            }
        ]
    }

    const mediaCommands: ICommands = {
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
            {
                name: "anime",
                description: "Baixa anime. Exemplo: $prefix$command symphogear ep=1",
                aliases: [],
                func: (_: IBot, message: IMessage, args: string[]) => {media.getAnime(message, args.join(" "))}
            },
            {
                name: "randomImage",
                description: "Envia uma imagem aleatoria",
                aliases: ["rdi", "image"],
                func: (_, message, args) => {media.getImageNekosApi(message, args)}
            },
            {
                name: "tagsfw",
                description: "Envia todas as tags para imagens",
                aliases: ["tagsfw"],
                func: (_, message) => {media.getImagesTags(message)}
            },
            {
                name: "tagnsfw",
                description: "Envia todas as tags para imagens",
                aliases: ["tagnsfw"],
                func: (_, message) => {media.getImagesTags(message, true)}
            },
            
        ]
    }
    
    const funCommands: ICommands = {
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
                func: (_: IBot, message: IMessage) => {diversao.slot(message)}
            },
            {
                name: "chance",
                description: "Chance de..., exemplo: $prefixchance de eu ganhar 1 real",
                aliases: [],
                func: (_: IBot, message: IMessage, args: string[]) => {diversao.chanceDe(message, args)}
            },
            {
                name: "perc",
                description: "Você é % ..., exemplo: $prefixperc gay",
                aliases: [],
                func: (_: IBot, message: IMessage, args: string[]) => {diversao.perc(message, args)}
            },
            {
                name: "gay",
                description: "O quanto vc é gay",
                aliases: [],
                func: (_: IBot, message: IMessage) => {diversao.nivelGay(message)}
            },
            {
                name: "gado",
                description: "O quanto vc é gado",
                aliases: [],
                func: (_: IBot, message: IMessage) => {diversao.nivelGado(message)}
            },
            {
                name: "casal",
                description: "Escolhe um casal aleatorio",
                aliases: [],
                func: (bot: IBot, message: IMessage, _: string[]) => {diversao.casal(message, bot)}
            },
            {
                name: "gpt",
                description: "Gera um texto",
                aliases: ["prompt"],
                func: (_: IBot, message: IMessage, args: string[]) => {diversao.gpt(message, args)}
            },
            {
                name: "copy",
                description: "Copia uma midia",
                aliases: [],
                func: (_, message: IMessage) => {diversao.copyMedia(message)}
            }
        ]
    }

    const adminCommands: ICommands = {
        category: "ADMIN",
        commands: [
            {
                name: "todos",
                description: "Marca todos os membros do chat",
                aliases: ["all"],
                func: (_: IBot, message: IMessage, args: string[]) => {admin.mentionAll(message, args)}
            },
            {
                name: "rebaixar",
                description: "Remove um usuário da lista de admins",
                aliases: ["demote"],
                func: (_, message) => {admin.demote(message)}
            },
            {
                name: "promover",
                description: "Adiciona um usuário à lista de admins",
                aliases: ["promote"],
                func: (_, message) => {admin.promote(message)}
            },
            {
                name: "transmitir",
                description: "Transmitir uma mensagem para todos os grupos em que o bot está",
                aliases: ["bc", "broadcast"],
                func: (bot, message, args) => {admin.broadcastToGroups(bot, message, args)}
            }
        ]
    }

    handler.register(infoCommands, funCommands, mediaCommands, adminCommands);
}
