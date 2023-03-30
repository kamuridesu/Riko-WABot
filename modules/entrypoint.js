import { commandHandler } from "./commands.js";
import path from 'path';

class Entrypoint {
    prefix = "/";
    ownerNumber = process.env.OWNER;
    botNumber = process.env.BOT;
    commandsFilename = "commands.js";
    botName = "Riko-chan";
    language = "pt-br";

    async chatHandlers(bot, message, context, group, metadata) {
        if (message === "test") {
            bot.replyText(context, "YEEEEEEy");
        }
    }

    async commandHandlers(bot, message, context, group, metadata) {
        // In this case, message can be also command to diferentiate the methods.
        commandHandler(bot, message, context, group, metadata);
    }
}

export {
    Entrypoint
};
