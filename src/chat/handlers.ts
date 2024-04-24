import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import * as funcs from "./chats.js";

import { Database } from "../utils/db.js";

const DATABASE = new Database();


async function chatsHandler(bot: IBot, message: string, context: IMessage) {
    await DATABASE.addToMessageCount(context.author.chatJid, context.author.jid);
    // await bot.connection?.readMessages([context.originalMessage.key]);
    const filters = (await DATABASE.getFilters(context.author.chatJid));
    if (filters.length > 0) {
        funcs.replyFilter(bot, context, filters);
    }
}

export {
    chatsHandler
};
