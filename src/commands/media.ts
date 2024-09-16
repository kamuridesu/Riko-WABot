import { KamTube, SearchAPIResponse } from "@kamuridesu/kamtube";
import { urlParse } from "@kamuridesu/kamtube/src/parsers.js";
import { Anime } from "@kamuridesu/kamuanimejs/dist/src/anime.js";
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

export async function thumbnail(message: IMessage, args: string[]) {
  if (args.length < 1) {
    await message.react(Emojis.fail);
    return await message.replyText("Faltando link da imagem!");
  }
  if (args.length > 1) {
    await message.react(Emojis.fail);
    return await message.replyText("Mais de um argumento recebido!");
  }
  const argument = args.join(" ");
  const regex =
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  if (!regex.test(argument)) {
    await message.react(Emojis.fail);
    return await message.replyText("Link inválido!");
  }
  try {
    const youtube = new KamTube();
    const videoId = urlParse(argument);
    const thumb = await youtube.getThumbnail(videoId);
    if (!thumb) throw new Error("Thumb não encontrada!");
    await message.replyMedia({ image: thumb } as any, "image", "image/jpg");
    return await message.react(Emojis.success);
  } catch (e) {
    await message.react(Emojis.fail);
    return await message.replyText("Erro ao enviar imagem");
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

export async function getAnime(message: IMessage, textMessage: string) {
  const anime = new Anime();
  await message.react(Emojis.searching);
  try {
    let { title, ep } = parseMessageToNameAndEpisode(
      textMessage.toLocaleLowerCase(),
    );
    message.react(Emojis.waiting);
    const data = await anime.downloadAnime(title, ep);
    await message.replyMedia(
      data.data as any,
      "video",
      "video/mp4",
      `${data.title} - ${ep}`,
    );
    return await message.react(Emojis.success);
  } catch (e) {
    console.log(e);
    message.react(Emojis.fail);
    return message.replyText(String(e));
  }
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

export async function getImagesTags(message: IMessage, isNsfw = false) {
  const api = new NekosAPIAxiosProxy();
  message.react(Emojis.searching);
  try {
    const tags = (await api.getAllTags()).filter(
      (tag) => tag.is_nsfw == isNsfw,
    );
    const allTags = tags.map((tag) => tag.name).join("\n");
    message.react(Emojis.success);
    await message.replyText(allTags);
  } catch (e) {
    message.react(Emojis.fail);
    await message.replyText("Algo deu errado!");
  }
}
