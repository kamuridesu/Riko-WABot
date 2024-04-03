import { EntryPoint, IBot, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import { CommandHandler } from "@kamuridesu/whatframework/libs/handlers.js";
import { chatsHandler } from "./src/chat/handlers.js";
import { registerCommands } from "./src/commands/commands.js";

class Entrypoint implements EntryPoint{
    prefix = "/";
    ownerNumber = process.env.OWNER as string;
    botName = "Riko-chan";
    language = "pt-br";
    handler = new CommandHandler();

    constructor() {
        registerCommands(this.handler);
    }

    async chatHandlers(bot: IBot, message: string, context: IMessage) {
        chatsHandler(bot, message, context);
    }

    async commandHandlers(bot: IBot, command: string, args: string[], context: IMessage) {
        this.handler.handle(command, bot, context, args);
    }
}

export {
    Entrypoint
};
