import { EntryPoint, IBot, IChatMetadata, IGroupData, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import { CommandHandler } from "@kamuridesu/whatframework/libs/handlers.js";
import { chatsHandler } from "./src/chat/handlers.js";
import { registerCommands } from "./src/commands/commands.js";

class Entrypoint implements EntryPoint{
    prefix = "/";
    ownerNumber = process.env.OWNER as string;
    botNumber = process.env.BOT as string;
    commandsFilename = "commands.js";
    botName = "Riko-chan";
    language = "pt-br";
    handler = new CommandHandler();

    constructor() {
        registerCommands(this.handler);
    }

    async chatHandlers(bot: IBot, message: string, context: IMessage, group: IGroupData | undefined, metadata: IChatMetadata) {
        chatsHandler(bot, message, context, group, metadata);
    }

    async commandHandlers(bot: IBot, command: string, args: string[], context: IMessage, group: IGroupData | undefined, metadata: IChatMetadata) {
        this.handler.handle(command, bot, context, args, group as IGroupData, metadata);
    }
}

export {
    Entrypoint
};
