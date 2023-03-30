import { createSticker } from 'whatframework/libs/sticker.js'
import { Bot } from 'whatframework/src/modules/bot.js';
import { GroupData } from 'whatframework/src/types/groupData.js';

async function makeSticker(context, bot, args) {
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

    return createSticker(context, bot, author, packname)
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
    let message = "Você perdeu!"
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

/**
 * 
 * @param {*} context 
 * @param {Bot} bot 
 * @param {GroupData} metadata 
 */
async function casal(context, bot, group) {
    if (!group) {
        return bot.replyText(context, "Erro! Comando pode ser usado apenas em um grupo!");
    }
    const membersExceptBot = group.members.filter((value) => value != bot.botNumber);
    let randomMember_1 = Math.round(Math.random() * membersExceptBot.length);
    let randomMember_2 = Math.round(Math.random() * membersExceptBot.length);
    while (randomMember_2 == randomMember_1 || membersExceptBot[randomMember_1] == undefined || membersExceptBot[randomMember_2] == undefined) {
        randomMember_2 = Math.round(Math.random() * membersExceptBot.length);
        randomMember_1 = Math.round(Math.random() * membersExceptBot.length);
    }
    let message = "❤️❤️ Meu casal ❤️❤️\n\n" + `${membersExceptBot[randomMember_1].id} + ${membersExceptBot[randomMember_2].id}`
    bot.replyText(context, message);
}

export {
   chanceDe, makeSticker, nivelGado, nivelGay, perc, slot, casal
};
