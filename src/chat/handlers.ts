import { IBot, IChatMetadata, IGroupData, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import * as funcs from "./chats.js";
import { mentionAll } from "../commands/admin.js";


async function chatsHandler(bot: IBot, message: string, context: IMessage, group: IGroupData | undefined, metadata: IChatMetadata) {
    if (/(s\/(?:\\S|[^/])+\/(?:\\S|[^/])(?:\/[gimyus]+)?)/.test(message)) {
        funcs.sed(bot, message, context);
    }
}

export {
    chatsHandler
};
