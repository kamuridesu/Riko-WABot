import { commandHandler } from "./commands.js";

class Entrypoint {
    prefix = "/";
    botNumber = "559885718484";
    ownerNumber = "559881953154";

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
