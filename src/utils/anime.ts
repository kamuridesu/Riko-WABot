import { Anime } from "@kamuridesu/kamuanimejs/dist/src/anime.js";
import { Telegram } from "@kamuridesu/kamuanimejs/dist/src/telegram.js";
import { IMessage } from "@kamuridesu/whatframework/@types/types.js";
import * as fs from "fs";


export let isAnimeEnabled = true;

if (!fs.existsSync("anime.json")) {
   isAnimeEnabled = false; 
}

const AnimeInstance = new Anime(new Telegram());
(async () => {
    await AnimeInstance.init();
})();

export function parseAnimeParams(message: IMessage) {
    const messageParts = message.body.split(" ");
    
    if (/s\d+s\d+/.test(messageParts[1])) {
    }
}

export async function DownloadAnime(title: string, episode: number, season: number) {
    return await AnimeInstance.download(title, episode);
}
