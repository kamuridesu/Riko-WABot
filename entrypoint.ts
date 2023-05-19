import { EntryPoint, IBot, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import { CommandHandler } from "@kamuridesu/whatframework/libs/handlers.js";
import { chatsHandler } from "./src/chat/handlers.js";
import { registerCommands } from "./src/commands/commands.js";
import { Database, FilterDB, PointsDB } from "./src/utils/db.js";
import { existsSync, mkdirSync } from "fs";

const DATABASE = new Database();
const FILTERDB = new FilterDB();
const POINTSDB = new PointsDB();

class Entrypoint implements EntryPoint{
    prefix = "/";
    ownerNumber = process.env.OWNER as string;
    botName = "Riko-chan";
    language = "pt-br";
    handler = new CommandHandler();

    constructor() {
        if (!existsSync("states/filter_media")) {
            mkdirSync("states/filter_media", {recursive: true});
        }
        registerCommands(this.handler, DATABASE, FILTERDB, POINTSDB);
    }

    async chatHandlers(bot: IBot, message: string, context: IMessage) {
        await chatsHandler(bot, message, context, DATABASE, FILTERDB);
    }

    async commandHandlers(bot: IBot, command: string, args: string[], context: IMessage) {
        const user = await DATABASE.getMember(context.author.chatJid, context.author.jid);
        if (user?.groupSilenced) {
            await bot.connection?.sendMessage(context.author.chatJid, {delete: context.originalMessage.key});
            return;
        }
        this.handler.handle(command, bot, context, args);
    }
}

export {
    Entrypoint
};
