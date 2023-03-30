import { KamTube } from 'kamtube';
import { Bot } from 'whatframework/src/modules/bot.js';
import Help from 'whatframework/libs/help.js'


async function start(context, bot) {
    return await bot.replyText(context, "Hey! Sou um simples bot, porém ainda estou em desevolvimento!\n\nCaso queira me apoiar no Patreon: https://www.patreon.com/kamuridesu\n\nO meu template: https://github.com/kamuridesu/WhatFramework");
}


async function help(data, bot, args) {
    const helper = new Help(bot);
    if (args.length >= 1) {
        const command_name = args[0];
        const command_data = await helper.getHelp(command_name);
        if (!command_data) return await bot.replyText(data, "Este comando não existe ou sua descrição está vazia!");
        return await bot.replyText(data, command_data);
    }
    return await bot.replyText(data, await helper.getCommandsByCategory());
}

/**
 * 
 * @param {*} context 
 * @param {Bot} bot 
 * @param {*} metadata 
 * @param {*} args 
 * @returns 
 */
async function bug(context, bot, metadata, args) {
    if (args.length < 1) {
        return await bot.replyText(context, "Por favor, digite o bug que você está reportando!");
    }
    const bug = args.join(" ");
    const sender = "https://wa.me/" + metadata.messageSender.split("@")[0];
    await bot.sendTextMessage(bot.ownerNumber + "@s.whatsapp.net", "Bug reportado por: " + sender + " \n\n" + bug);
    return await bot.replyText(context, "Bug reportado com sucesso! O abuso desse comando pode ser punido!");
}

async function download(context, bot, args, video_audio="mixed") {
  
    if (args.length < 1) {
      return await bot.replyText(
        context,
        `Por favor, escolha um ${video_or_audio == "mixed" ? "video": "audio"} para baixar!`
      );
    }
  
    const youtube = new KamTube();
    let argument = args.join(" ");
  
    const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
    if (!regex.test(argument)) {
      try {
        let c = 0;
        do {
            argument = (await youtube.search(argument))[c];
            c++;
        } while (argument.type == "channel");
        argument = argument.videoId;
      } catch (e) {
        return await bot.replyText(context, "Houve um erro ao processar!");
      }
    }
  
    await bot.replyText(context, "Aguarde enquanto eu baixo...");
  
    let video = null;
  
    try {
      video = await youtube.download(argument, video_audio, video_audio == "audio" ? undefined : "360");
    } catch (e) {
      console.log(e);
      return await bot.replyText(context, "Houve um erro ao baixar");
    }
  
    console.log("Video downloaded!");
  
    if (video != null) {
      const mediaType = video_audio != "audio" ? "video" : "audio";
      await bot.replyMedia(context, video.data, mediaType, `${mediaType}/mp4`);
    } else {
      return await bot.replyText(context, "Houve um erro ao processar!");
    }
  }
  
async function downloadImage(context, bot, args) {
    // retorna uma imagem de uma url
    // baixa uma imagem a partir de uma url e baixa a imagem
    let error = ""
    if (args.length < 1) {
        error = "Error! Preciso que uma url seja enviada!";
    } else if (args.length > 1) {
        error = "Error! Muitos argumentos!";
    } else {
        return await bot.replyMedia(context, args[0], "image", "image/png");
    }
    return await bot.replyText(context, error);
}

async function thumbnail(context, bot, args) {
    if(args.length < 1) {
        error = "Error! Preciso que uma url seja passada!";
    } else if (args.length > 1) {
        error = "Error! Muitos argumentos!";
    } else if (/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi.test(args.join(" "))) {
        let youtube = new KamTube();
        let argument = args.join(" ");
        if (argument.includes("youtu.be")) {
            argument = argument.split("/");
            let id = 0;
            if ("shorts" in argument) {
                id = argument[4];
            } else {
                id = argument[3];
            }
            argument = id;
        } else if (argument.includes("youtube.com")) {
            argument = argument.replace("youtube.com/watch?=");
        }
        try{
            let thumbnail = await youtube.getThumbnail(argument);
            console.log(thumbnail)
            return await bot.replyMedia(context, thumbnail, "image");
        } catch (e) {
            error = "Error! Não foi possível encontrar o thumbnail!";
        }
    }
    return await bot.replyText(context, error);
}



export {
    start, download, downloadImage, thumbnail, bug, help
};
