import { KamTube, SearchAPIResponse } from "@kamuridesu/kamtube";
import { isAnimeEnabled, DownloadAnime } from "../utils/anime.js";
import { Letras } from "@kamuridesu/simplelyrics";
import { IMessage } from "@kamuridesu/whatframework/@types/message";
import { TagNames, Tags } from "nekosapi/v3/types/Tags.js";
import { Emojis } from "../utils/emoji.js";
import { convertToOpus } from "../utils/media.js";
import {
  NekosAPIAxiosProxy,
  fetchResponse,
  getRandomImageFromApi,
} from "../utils/nekoapi.js";
import { parseMessageToNameAndEpisode } from "../utils/parsers.js";
import { downloadMedia } from "../utils/cobalt.js";

export async function download(
  message: IMessage,
  args: string[],
  video_audio = "mixed",
) {
  if (args.length < 1) {
    await message.react(Emojis.fail);
    return await message.replyText(
      `Por favor, escolha um ${video_audio == "mixed" ? "video" : "audio"} para baixar!`,
    );
  }

  await message.react(Emojis.searching);

  const youtube = new KamTube();
  let argument: string = args.join(" ");

  let videoId = argument;

  const mediaType = video_audio != "audio" ? "video" : "audio";

  const regex =
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  if (!regex.test(argument)) {
    await message.react(Emojis.fail);
    return await message.replyText("Infelizmente o YouTube bloqueou o bot, estou trabalhando para resolver isso mas deve demorar um pouco.");
    try {
      let result: SearchAPIResponse;
      let c = 0;
      const results = await youtube.search(argument);
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
      videoId = `https://www.youtube.com/watch?v=${result.videoId}`;
    } catch (e) {
      console.log(e);
      await message.react(Emojis.fail);
      return await message.replyText("Houve um erro ao pesquisar!");
    }
  }

  if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
    await message.react(Emojis.fail);
    return await message.replyText("Infelizmente o YouTube bloqueou o bot, estou trabalhando para resolver isso mas deve demorar um pouco.");
  }

  try {
    await message.react(Emojis.waiting);
    const video = await downloadMedia(videoId, mediaType);
    if (video == null) {
      await message.react(Emojis.fail);
      return await message.replyText(`Houve um erro ao baixar ${mediaType}!`);
    }

    if (mediaType === "audio") {
      video.blob = await convertToOpus(video.blob);
    }

    await message.replyMedia(video.blob as any,
      mediaType,
      `${mediaType}/mp4`,
      video.filename
    );
    return await message.react(Emojis.success);
  } catch (e) {
    console.log(e);
    await message.react(Emojis.fail);
    return await message.replyText("Houve um erro ao baixar");
  }
}

export async function getLyrics(message: IMessage, args: string[]) {
  let error = "Erro desconhecido!";
  let reaction = Emojis.fail;
  const letras = new Letras();
  const result = await letras.search(args.join(" "));
  if (result !== null) {
    const lyrics = await letras.getLyrics(result);
    if (lyrics !== null) {
      reaction = Emojis.success;
      await message.react(reaction);
      return await message.replyText(lyrics);
    } else {
      reaction = Emojis.fail;
      error = "Erro: Falha ao pegar as letras.";
    }
  } else {
    reaction = Emojis.fail;
    error = "Erro: Falha ao procurar pela música.";
  }
  await message.react(reaction);
  return await message.replyText(error);
}

export async function getImageNekosApi(message: IMessage, args: string[]) {
  const api = new NekosAPIAxiosProxy();
  if (args.length < 1) {
    return await getRandomImageFromApi(message, api);
  }
  let capitalizedTags: TagNames[] = [];
  message.react(Emojis.searching);
  for (let tag of args) {
    const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
    capitalizedTags.push(capitalizedTag as unknown as TagNames);
    if (!Object.keys(Tags).includes(capitalizedTag)) {
      message.react(Emojis.fail);
      return await message.replyText("Erro! Tag não encontrada!");
    }
  }
  const images = await api.getImages(capitalizedTags);
  const image = images[Math.round(Math.random() * images.length)];
  if (image == undefined) {
    message.react(Emojis.fail);
    return await message.replyText("Erro! Imagem não encontrada!");
  }
  const dwldImage: any = await fetchResponse(new URL(image.image_url), true);
  await message.replyMedia(dwldImage, "image");
  message.react(Emojis.success);
}

export async function downloadAnime(message: IMessage, args: string[]) {
  if (args.length < 1) {
    await message.react(Emojis.fail);
    return await message.replyText("Por favor, escolha um anime para baixar!");
  }
  const { title, season, episode } = parseMessageToNameAndEpisode(args.join(" "));
  if (title == null) {
    await message.react(Emojis.fail);
    return await message.replyText("Por favor, escolha um anime para baixar!");
  }
  if (episode == null) {
    await message.react(Emojis.fail);
    return await message.replyText("Por favor, escolha um episódio para baixar! (Ex: /anime Naruto ep=1)");
  }
  await message.react(Emojis.waiting);
  try {
    const download = await DownloadAnime(title, episode, season);
    if (download == null) {
      await message.react(Emojis.fail);
      return await message.replyText("Erro! Não foi possível baixar o anime!");
    }
    await message.replyMedia({media: (download.data as Buffer).buffer as Buffer, messageType: "video", mimeType: "media/mp4", error: undefined}, "video", undefined, download.title);
    await message.react(Emojis.success);
  } catch (e) {
    console.log(e);
    await message.react(Emojis.fail);
    return await message.replyText("Erro! Não foi possível baixar o anime!");
  }
}
