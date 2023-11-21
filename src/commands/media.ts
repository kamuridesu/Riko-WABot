import { IMessage } from "@kamuridesu/whatframework/@types/message";
import {KamTube} from "@kamuridesu/kamtube";
import { Letras } from "@kamuridesu/simplelyrics";

export async function download(message: IMessage, args: string[], video_audio = "mixed") {
    if (args.length < 1) {
        await message.react("❌");
        return await message.replyText(
            `Por favor, escolha um ${video_audio == "mixed" ? "video" : "audio"} para baixar!`
        );
    }

    await message.react("🔍");

    const youtube = new KamTube();
    let argument: any = args.join(" ");

    let videoId = "";
    let videoTitle = "";

    const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
    if (!regex.test(argument)) {
        try {
            let c = 0;
            const results = (await youtube.search(argument));
            do {
                argument = results[c];
                c++;
                if (c == results.length) {
                    await message.react("❌");
                    return await message.replyText("Erro! Nenhum vídeo encontrado!")
                }
            } while (argument.type == "channel" || argument.type == "playlist");
            videoId = argument.videoId;
            videoTitle = argument.title;
        } catch (e) {
            console.log(e);
            await message.react("❌");
            return await message.replyText("Houve um erro ao processar!");
        }
    }

    await message.react("⏳");

    let video = null;

    try {
        video = await youtube.download(videoId, video_audio, video_audio == "audio" ? undefined : "360");
    } catch (e) {
        console.log(e);
        await message.react("❌");
        return await message.replyText("Houve um erro ao baixar");
    }

    console.log("Video downloaded!");

    if (video != null) {
        const mediaType = video_audio != "audio" ? "video" : "audio";
        const sentMessage = await message.replyMedia(video.data as any, mediaType, `${mediaType}/mp4`, videoTitle);
        if (sentMessage == undefined) {
            return await message.react("❌");
        }
        return await message.react("✅");
    } else {
        await message.react("❌");
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
            await message.react("❌");
            error = "Error! Não foi possível encontrar o thumbnail!";
        }
    }
    return await message.replyText(error);
}

export async function getLyrics(message: IMessage, args: string[]) {
    let error = "Erro desconhecido!";
    let reaction = "❌";
    const letras = new Letras();
    const result = await letras.search(args.join(" "));
    if (result !== null) {
        const lyrics = await letras.getLyrics(result);
        if (lyrics !== null) {
            reaction = "✅"
            await message.react(reaction);
            return await message.replyText(lyrics);
        } else {
            reaction = "❌";
            error = ('Erro: Falha ao pegar as letras.');
        }
    } else {
        reaction = "❌";
        error = ('Erro: Falha ao procurar pela música.');
    }
    await message.react(reaction);
    return await message.replyText(error);
}
