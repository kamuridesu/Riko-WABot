import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import * as funcs from "./chats.js";
import { mentionAll } from "../commands/admin.js";

import { Database } from "../utils/db.js";

const DATABASE = new Database();


async function chatsHandler(bot: IBot, message: string, context: IMessage) {
    const filters = (await DATABASE.getFilters(context.author.chatJid));
    if (filters.length > 0) {
        funcs.replyFilter(bot, context, filters);
    }
}

export {
    chatsHandler
};
