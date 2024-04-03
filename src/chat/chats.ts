import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types";
import { Filter } from "../utils/db";


export async function replyFilter(bot: IBot, message: IMessage, filters: Filter[]) {
    for (let filter of filters) {
        if (message.body.includes(filter.pattern)) {
            return await bot.replyText(message, filter.response, {});
        }
    }
}