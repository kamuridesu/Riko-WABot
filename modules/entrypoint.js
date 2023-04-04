import { commandHandler } from "./commands.js";
import { chatsHandler } from "./chats.js";

class Entrypoint {
    prefix = "/";
    ownerNumber = process.env.OWNER;
    botNumber = process.env.BOT;
    commandsFilename = "commands.js";
    botName = "Riko-chan";
    language = "pt-br";

    async chatHandlers(bot, message, context, group, metadata) {
        chatsHandler(bot, message, context, group, metadata);
    }

    async commandHandlers(bot, command, args, context, group, metadata) {
        commandHandler(bot, command, args, context, group, metadata);
    }
}

export {
    Entrypoint
};
