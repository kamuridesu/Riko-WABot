import KamTube from 'kamtube';
import { createStickerFromMedia } from 'whatframework/src/libs/sticker.js';


async function start(context, bot) {
    return await bot.replyText(context, "Hey! Sou um simples bot, porém ainda estou em desevolvimento!\n\nCaso queira me apoiar no Patreon: https://www.patreon.com/kamuridesu\n\nO meu template: https://github.com/kamuridesu/WhatFramework");
}

// async function bug(context, bot, metadata, args) {
//     if (args.length < 1) {
//         return await bot.replyText(context, "Por favor, digite o bug que você está reportando!");
//     }
//     const bug = args.join(" ");
//     const sender = "wa.me/" + metadata.messageSender.split("@")[0];
//     await bot.sendTextMessage(context, "Bug reportado por: " + sender + "\n\n" + bug, bot.owner_jid);
//     return await bot.replyText(context, "Bug reportado com sucesso! O abuso desse comando pode ser punido!");
// }

async function download(context, bot, args, video_audio) {
    let video_or_audio = video_audio ? "audio" : "video";
  
    if (args.length < 1) {
      return await bot.replyText(
        context,
        `Por favor, escolha um ${video_or_audio} para baixar!`
      );
    }
  
    const youtube = new KamTube();
    let argument = args.join(" ");
  
    const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  
    if (!regex.test(argument)) {
      try {
        argument = (await youtube.search(argument))[0].videoId;
      } catch (e) {
        return await bot.replyText(context, "Houve um erro ao processar!");
      }
    }
  
    await bot.replyText(context, "Aguarde enquanto eu baixo...");
  
    let video = null;
  
    try {
      video = await youtube.download(argument, video_audio);
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
    if (args.length < 1) {
        error = "Error! Preciso que uma url seja enviada!";
    } else if (args.length > 1) {
        error = "Error! Muitos argumentos!";
    } else {
        return await bot.replyMedia(context, args[0], "image", "image/png");
    }
    return await bot.replyText(context, error);
}

async function createSticker(context, bot, args) {
    let packname = "Riko's stickers collection";
    let author = "Riko Bot";

    if (args.length >= 1) {
        if (["help", "ajuda"].includes(args[0])) {
            return bot.replyText("Use !sticker para criar um sticker, ou !sticker pacote autor para mudar o pacote e o autor!");
        }
        if (args.length == 2) {
            packname = args[0];
            author = args[1];
        }
    }

    let media = await getStickerMedia(context);
    if (media !== undefined) {
        media = await downloadAndSaveMediaMessage(media, "file" + Math.round(Math.random() * 10000));
        return await createStickerFromMedia(bot, data, media, packname, author);
    }

    return await bot.replyText(data, "Não suportado!");
}

async function getStickerMedia(context) {
    if (context.type === "imageMessage") {
        return context;
    }
    if (context.type === "videoMessage" && context.seconds < 11) {
        return context;
    }
    if (context.hasQuotedMessage) {
        const quotedMessage = JSON.parse(JSON.stringify(context.originalMessage).replace('quotedM', 'm')).message;
        if (quotedMessage.extendedTextMessage && quotedMessage.extendedTextMessage.contextInfo) {
            const quotedContext = quotedMessage.extendedTextMessage.contextInfo;
            if (quotedContext.quotedMessage && quotedContext.quotedMessage.videoMessage && quotedContext.quotedMessage.videoMessage.seconds < 11) {
                return quotedContext.quotedMessage;
            }
            if (quotedContext.quotedMessage && quotedContext.quotedMessage.imageMessage) {
                return quotedContext.quotedMessage;
            }
        }
    }
    return undefined;
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


async function nivelGado(context, bot) {
    let message = [
        "ultra extreme gado",
        "Gado-Master",
        "Gado-Rei",
        "Gado",
        "Escravo-ceta",
        "Escravo-ceta Maximo",
        "Gacorno?",
        "Jogador De Forno Livre<3",
        "Mestre Do Frifai<3<3",
        "Gado-Manso",
        "Gado-Conformado",
        "Gado-Incubado",
        "Gado Deus",
        "Mestre dos Gados",
        "Topa tudo por buceta",
        "Gado Comum",
        "Mini Gadinho",
        "Gado Iniciante",
        "Gado Basico",
        "Gado Intermediario",
        "Gado Avançado",
        "Gado Profisional",
        "Gado Mestre",
        "Gado Chifrudo",
        "Corno Conformado",
        "Corno HiperChifrudo",
        "Chifrudo Deus",
        "Mestre dos Chifrudos"
    ];
    let choice = message[Math.floor(Math.random() * message.length)];
    message = `Você é:\n\n${choice}`;
    return await bot.replyText(context, message);
}

async function slot(context, bot) {
    // data.sender_data.slot_chances = data.sender_data.slot_chances - 1;
    const fruits_array = ['🥑', '🍉', '🍓', '🍎', '🍍', '🥝', '🍑', '🥥', '🍋', '🍐', '🍌', '🍒', '🔔', '🍊', '🍇']
    // const fruits_array = ['🥑', '🍉']
    let winner = []
    for (let i = 0; i < 3; i++) {
        winner.push(fruits_array[Math.floor(Math.random() * fruits_array.length)]);
    }
    if ((winner[0] === winner[1]) && (winner[1] === winner[2]) && (winner[2] == winner[0])) {
        message = "Você ganhou!";
    }
    const slot_message =
        `Consiga 3 iguais para ganhar
╔═══ ≪ •❈• ≫ ════╗
║         [💰SLOT💰 | 777 ]        
║                                             
║                                             
║           ${winner.join(" : ")}  ◄━━┛
║            
║                                           
║         [💰SLOT💰 | 777 ]        
╚════ ≪ •❈• ≫ ═══╝

${message}`
    return bot.replyText(context, slot_message);
}

async function nivelGay(context, bot) {
    const responses = [
        'hmm... é hetero😔',
        '+/- boiola',
        'tenho minha desconfiança...😑',
        'é né?😏',
        'é ou não?🧐',
        'é gay🙈'
    ]
    const percentage = Math.round(Math.random() * 100);
    const index = percentage <= 10 ? 0 : (percentage > 10 && percentage <= 20 ? 1 : (percentage > 20 && percentage <= 30 ? 2 : (percentage > 30 && percentage <= 40 ? 3 : (percentage > 40 && percentage <= 50 ? 4 : 5))));
    const response = `Você é ${percentage}% gay\n\n${responses[index]}`
    return bot.replyText(context, response);
}

async function chanceDe(context, bot, args) {
    if (args.length == 0) {
        error = "Você precisa especificar qual a chance, ex: !chance de eu ficar off";
    } else {
        const text = args.join(" ");
        if (text.includes("virgindade") || text.includes("virgindade") || text.includes("virgem")) {
            return await bot.replyText(context, "Nenhuma");
        }
        return await bot.replyText(context, "A chance " + text + " é de " + Math.round(Math.random() * 100) + "%");
    }
    return await bot.replyText(context, error);
}

async function perc(context, bot, args) {
    if (args.length == 0) {
        error = "Você dizer o nome da porcentagem!";
    } else {
        const text = args.join(" ");
        return await bot.replyText(context, "Você é " + Math.round(Math.random() * 100) + "% " + text);
    }
    return await bot.replyText(context, error);
}

export {
    start, download, chanceDe, createSticker, downloadImage, getStickerMedia, nivelGado, nivelGay, perc, slot, thumbnail
};
