/* eslint-disable no-fallthrough */
import * as commands from './commandsImpl.js';

/* TODOS OS COMANDOS DEVEM ESTAR NESTE ARQUIVO, MENOS OS COMANDOS SEM PREFIXO.
CASO PRECISE DE FUNÇÕES GRANDES, SIGA A BOA PRÁTICA E ADICIONE ELAS NO ARQUIVO commandsImpl.js,
DEPOIS FAÇA IMPORT DESSA FUNÇÃO PARA ESTE ARQUIVO E USE NO SEU COMANDO!
*/

/**
 * Handles the commands sent to the bot
 * @param {Bot} bot bot instance
 * @param {string} cmd command sent
 * @param {object} context
 * @returns undefined
 */
async function commandHandler(bot, message, context, group, metadata) {
    const command = message.split('/')[1].split(" ")[0].toLowerCase(); // get the command
    if (command.length == 0) return; // if the command is empty, return
    const args = message.split(" ").slice(1); // get the arguments (if any) from the command

    switch (command) {

        /* %$INFO$% */

        case "start":
            // comment="retorna uma apresentação do bot"
            return await commands.start(context, bot);

        case "test":
            // comment="retorna um teste"
            return await bot.replyText(context, "testando 1 2 3");

        /* %$ENDINFO$% */

        /* %$MIDIA$% */

        case "music": {
            // comment="envia uma música a partir de um link ou pequisa no youtube, ex: !music link_da_musica"
            return await commands.download(context, bot, args, "audio");
        }

        case "video": {
            // comment="envia um vídeo a partir de um link ou pequisa no youtube, ex: !video link_do_video"
            return await commands.download(context, bot, args, "360");
        }

        case "image": {
            // comment="gera uma imagem a partir de uma url, ex: !image http://kamuridesu.tech/static/images/github_logo.png"
            return await commands.downloadImage(context, bot, args);
        }

        case "thumbnail": {
            // comment="Baixa e envia uma thumbnail de um video no youtube, ex: !thumbnail https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            return await commands.thumbnail(context, bot, args);
        }


        /* %$ENDMIDIA$% */

        /* %$DIVERSAO$% */

        case 'sticker': {
            // comment="cria sticker"
            return await commands.createSticker(context, bot, args);
        }

        case "gado": {
            // comment="mostra seu nivel de gado"
            return await commands.nivelGado(context, bot);
        }

        case "slot": {
            // comment="joga um slot"
            return await commands.slot(context, bot);
        }

        case "gay": {
            // comment="mostra seu nivel de gay"
            return await commands.nivelGay(context, bot);
        }

        case "chance": {
            // comment="mostra uma chance de algo, ex: chance de eu ganhar na loteria"
            return await commands.chanceDe(context, bot, args);
        }

        case "perc": {
            // comment="mostra uma porcentagem, ex: perc hombre"
            return await commands.perc(context, bot, args);
        }


        /* %$ENDDIVERSAO$% */

    }
}

export { commandHandler };