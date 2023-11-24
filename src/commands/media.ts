import { IMessage } from "@kamuridesu/whatframework/@types/message";
import {KamTube, SearchAPIResponse} from "@kamuridesu/kamtube";
import { Letras } from "@kamuridesu/simplelyrics";
import { Anime } from "@kamuridesu/kamuanimejs/dist/src/anime.js";
import { Emojis } from "../utils/emoji.js";
import { parseMessageToNameAndEpisode } from "../utils/parsers.js";

export async function download(message: IMessage, args: string[], video_audio = "mixed") {
    if (args.length < 1) {
        await message.react(Emojis.fail);
        return await message.replyText(
            `Por favor, escolha um ${video_audio == "mixed" ? "video" : "audio"} para baixar!`
        );
    }

    await message.react(Emojis.searching);

    const youtube = new KamTube();
    let argument: string= args.join(" ");

    let videoId = "";
    let videoTitle = "";

    const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
    if (!regex.test(argument)) {
        try {
            let result: SearchAPIResponse;
            let c = 0;
            const results = (await youtube.search(argument));
            if (!results) {
                await message.react(Emojis.fail);
                return await message.replyText("Erro! Nenhum vídeo encontrado!");
            }
            do {
                result = results[c];
                c++;
                if (c == results.length) {
                    await message.react(Emojis.fail);
                    return await message.replyText("Erro! Nenhum vídeo encontrado!");
                }
            } while (result.type == "channel" || result.type == "playlist");
            videoId = result.videoId as string;
            videoTitle = result.title as string;
        } catch (e) {
            console.log(e);
            await message.react(Emojis.fail);
            return await message.replyText("Houve um erro ao processar!");
        }
    }

    await message.react(Emojis.waiting);

    let video = null;

    try {
        video = await youtube.download(videoId, video_audio, video_audio == "audio" ? undefined : "360");
    } catch (e) {
        console.log(e);
        await message.react(Emojis.fail);
        return await message.replyText("Houve um erro ao baixar");
    }

    console.log("Video downloaded!");

    if (video != null) {
        const mediaType = video_audio != "audio" ? "video" : "audio";
        const sentMessage = await message.replyMedia(video.data as any, mediaType, `${mediaType}/mp4`, videoTitle);
        if (sentMessage == undefined) {
            return await message.react(Emojis.fail);
        }
        return await message.react(Emojis.success);
    } else {
        await message.react(Emojis.fail);
        return await message.replyText("Houve um erro ao processar!");
    }
}

export async function thumbnail(message: IMessage, args: string[]) {
    let error = "Erro desconhecido";
    if (args.length < 1) {
        error = "Error! Preciso que uma url seja passada!";
    } else if (args.length > 1) {
        error = "Error! Muitos argumentos!";
    } else if (/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi.test(args.join(" "))) {
        let youtube = new KamTube();
        let argument = args.join(" ");
        if (argument.includes("youtu.be")) {
            const argumentSplit = argument.split("/");
            let id: string | number = 0;
            if ("shorts" in argumentSplit) {
                id = argument[4];
            } else {
                id = argument[3];
            }
            argument = id;
        } else if (argument.includes("youtube.com")) {
            argument = argument.replace("youtube.com/watch?=", "");
        }
        try {
            let thumbnail = await youtube.getThumbnail(argument);
            return await message.replyMedia(thumbnail as string, "image");
        } catch (e) {
            await message.react(Emojis.fail);
            error = "Error! Não foi possível encontrar o thumbnail!";
        }
    }
    return await message.replyText(error);
}

export async function getLyrics(message: IMessage, args: string[]) {
    let error = "Erro desconhecido!";
    let reaction = Emojis.fail;
    const letras = new Letras();
    const result = await letras.search(args.join(" "));
    if (result !== null) {
        const lyrics = await letras.getLyrics(result);
        if (lyrics !== null) {
            reaction = Emojis.success
            await message.react(reaction);
            return await message.replyText(lyrics);
        } else {
            reaction = Emojis.fail;
            error = ('Erro: Falha ao pegar as letras.');
        }
    } else {
        reaction = Emojis.fail;
        error = ('Erro: Falha ao procurar pela música.');
    }
    await message.react(reaction);
    return await message.replyText(error);
}

export async function getAnime(message: IMessage, textMessage: string) {
    const anime = new Anime();
    await message.react(Emojis.searching);
    try {
        let {title, ep} = parseMessageToNameAndEpisode(textMessage.toLocaleLowerCase());
        message.react(Emojis.waiting);
        const data = await anime.downloadAnime(title, ep);
        await message.replyMedia(data.data as any, "video", "video/mp4", `${data.title} - ${ep}`);
        return await message.react(Emojis.success);
    } catch (e) {
        console.log(e);
        message.react(Emojis.fail);
        return message.replyText(String(e));
    }
}
