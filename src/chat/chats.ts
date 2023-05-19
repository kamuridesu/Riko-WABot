import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types";
import { Filter } from "../utils/db";
import { readFile } from "fs/promises";


export async function replyFilter(bot: IBot, message: IMessage, filters: Filter[]) {
    for (let filter of filters) {
        if (message.body.includes(filter.pattern)) {
            if (filter.kind == "conversation") return await bot.replyText(message, filter.response, {});
            if (filter.kind == "stickerMessage") {
                const media = await readFile(filter.response);
                return await bot.replyMedia(message, media as any, "sticker");
            }
            if (filter.kind == "imageMessage") {
                const media = await readFile(filter.response);
                return await bot.replyMedia(message, media as any, "image", "image/png");
            }
        }
    }
}
