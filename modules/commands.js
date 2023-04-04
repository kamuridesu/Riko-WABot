import * as commands from './commandsImpl.js';
import * as diversao from "./diversao.js";

/**
 * Handles the commands sent to the bot
 * @param {Bot} bot bot instance
 * @param {string} cmd command sent
 * @param {object} context
 * @returns undefined
 */
async function commandHandler(bot, command, args, context, group, metadata) {

    switch (command) {

        /* %$INFO$% */
        case "start":
            // comment="retorna uma apresentação do bot"
            return await commands.start(context, bot);

        case "ajuda":
        // comment="retorna um menu de comandos, envie um comando para saber mais sobre o mesmo, ex: ajuda ajuda"
        case "menu":
        // comment="retorna um menu de comandos, envie um comando para saber mais sobre o mesmo, ex: menu menu"
        case "todoscmd": {
            // comment="retorna um menu de comandos, envie um comando para saber mais sobre o mesmo, ex: todos_cmd todos_cmd"
            return await commands.help(context, bot, args);
        }

        case "bug":
            return await commands.bug(context, bot, metadata, args);

        case "test":
            // comment="retorna um teste"
            return await bot.replyText(context, "testando 1 2 3");
        /* %$ENDINFO$% */

        /* %$MIDIA$% */
        case "music": {
            // comment="envia uma música a partir de um link ou pequisa no youtube, ex: music link_da_musica"
            return await commands.download(context, bot, args, "audio");
        }

        case "video": {
            // comment="envia um vídeo a partir de um link ou pequisa no youtube, ex: video link_do_video"
            return await commands.download(context, bot, args);
        }

        case "letra": {
            // comment="retorna a letra de uma musica. ex: /letra never gonna give you up"
            return await commands.getLyrics(context, bot, args);
        }

        case "image": {
            // comment="gera uma imagem a partir de uma url, ex: image http://kamuridesu.tech/static/images/github_logo.png"
            return await commands.downloadImage(context, bot, args);
        }

        case "thumbnail": {
            // comment="Baixa e envia uma thumbnail de um video no youtube, ex: thumbnail https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            return await commands.thumbnail(context, bot, args);
        }
        /* %$ENDMIDIA$% */

        /* %$DIVERSAO$% */
        case 'sticker': {
            // comment="cria sticker"
            return await diversao.makeSticker(context, bot, args);
        }

        case "gado": {
            // comment="mostra seu nivel de gado"
            return await diversao.nivelGado(context, bot);
        }

        case "slot": {
            // comment="joga uma slot machine"
            return await diversao.slot(context, bot);
        }

        case "gay": {
            // comment="mostra seu nivel de gay"
            return await diversao.nivelGay(context, bot);
        }

        case "chance": {
            // comment="mostra uma chance de algo, ex: chance de eu ganhar na loteria"
            return await diversao.chanceDe(context, bot, args);
        }

        case "perc": {
            // comment="mostra uma porcentagem, ex: perc maacho"
            return await diversao.perc(context, bot, args);
        }

        case "casal": {
            // comment="Escolhe um casal aleatório no grupo"
            return await diversao.casal(context, bot, group)
        }
        /* %$ENDDIVERSAO$% */
    }
}

export { commandHandler };