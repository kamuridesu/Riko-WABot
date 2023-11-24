import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types";

async function sed(bot: IBot, message: string, context: IMessage) {
    if (context.hasQuotedMessage && context.quotedMessageType == "conversation") {

        const match = message.match(/^s\/(.*?)\/(.*?)(?:\/(.*))?$/);
        if (!match) {
            return await context.replyText('fuck me! invalid pattern');
        }
        const [, searchPattern, replacement, flags] = match;
        const regex = new RegExp(searchPattern, flags || '');
        const modifiedMessage = context.quotedMessage.message.conversation.replace(regex, replacement);
        const quoted: any = (await bot.loadMessage(context));
        if (quoted) {
            const options = {
                quoted: quoted.originalMessage
            }
            return bot.sendTextMessage(context, modifiedMessage, options);
        }
        return context.replyText(modifiedMessage, {});
    }
}

export {
    sed,
};
