import { IBot, IGroupData, IMessage } from "@kamuridesu/whatframework/@types/types.js";
import { createSticker } from "@kamuridesu/whatframework/libs/sticker.js";

import { GPT } from "../utils/gpt.js";

const gptInstance = new GPT();

export async function makeSticker(bot: IBot, message: IMessage, args: string[]) {
    let packname = "Riko's stickers collection";
    let author = "Riko Bot";

    if (args.length >= 1) {
        if (["help", "ajuda"].includes(args[0])) {
            return message.replyText(`Use ${bot.prefix}sticker para criar um sticker, ou !sticker pacote autor para mudar o pacote e o autor!`);
        }
        if (args.length == 2) {
            packname = args[0];
            author = args[1];
        }
    }

    return createSticker(message, bot, author, packname)
}

export async function nivelGado(message: IMessage) {
    let messages = [
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
    let choice = `Você é:\n\n${messages[Math.floor(Math.random() * messages.length)]}`;
    return await message.replyText(choice);
}

export async function slot(message: IMessage) {
    // data.sender_data.slot_chances = data.sender_data.slot_chances - 1;
    const fruits_array = ['🥑', '🍉', '🍓', '🍎', '🍍', '🥝', '🍑', '🥥', '🍋', '🍐', '🍌', '🍒', '🔔', '🍊', '🍇']
    // const fruits_array = ['🥑', '🍉']
    let winner = []
    for (let i = 0; i < 3; i++) {
        winner.push(fruits_array[Math.floor(Math.random() * fruits_array.length)]);
    }
    let _message = "Você perdeu!"
    if ((winner[0] === winner[1]) && (winner[1] === winner[2]) && (winner[2] == winner[0])) {
        _message = "Você ganhou!";
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

${_message}`
    return message.replyText(slot_message);
}

export async function nivelGay(message: IMessage) {
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
    return message.replyText(response);
}

export async function chanceDe(message: IMessage, args: string[]) {
    let error = "Erro desconhecido!";
    if (args.length == 0) {
        error = "Você precisa especificar qual a chance, ex: !chance de eu ficar off";
    } else {
        const text = args.join(" ");
        if (text.includes("virgindade") || text.includes("virgindade") || text.includes("virgem")) {
            return await message.replyText("Nenhuma");
        }
        return await message.replyText("A chance " + text + " é de " + Math.round(Math.random() * 100) + "%");
    }
    return await message.replyText(error);
}

export async function perc(message: IMessage, args: string[]) {
    let error = "Erro desconhecido!";
    if (args.length == 0) {
        error = "Você dizer o nome da porcentagem!";
    } else {
        const text = args.join(" ");
        return await message.replyText("Você é " + Math.round(Math.random() * 100) + "% " + text);
    }
    return await message.replyText(error);
}

export async function casal(message: IMessage, bot: IBot, group: IGroupData) {
    if (!group) {
        return message.replyText("Erro! Comando pode ser usado apenas em um grupo!");
    }
    const membersExceptBot = group.members.filter((value) => value.id.split("@")[0] != bot.botNumber);
    console.log(membersExceptBot);
    console.log(bot.botNumber);
    let randomMember_1 = Math.round(Math.random() * membersExceptBot.length);
    let randomMember_2 = Math.round(Math.random() * membersExceptBot.length);
    while (randomMember_2 == randomMember_1 || membersExceptBot[randomMember_1] == undefined || membersExceptBot[randomMember_2] == undefined) {
        randomMember_2 = Math.round(Math.random() * membersExceptBot.length);
        randomMember_1 = Math.round(Math.random() * membersExceptBot.length);
    }
    let _message = "❤️❤️ Meu casal ❤️❤️\n\n" + `${membersExceptBot[randomMember_1].id} + ${membersExceptBot[randomMember_2].id}`
    message.replyText(_message);
}

export async function gpt(message: IMessage, args: string[]) {
    if (args == undefined) return message.replyText("A mensagem não pode ser vazia!");
    console.log(message.body)
    await message.replyText("Gerando resposta...");
    return gptInstance.generate(message);
}