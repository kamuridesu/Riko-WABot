import { IBot, IMessage } from "@kamuridesu/whatframework/@types/types";

async function sed(bot: IBot, message: string, context: IMessage) {
    if (context.hasQuotedMessage && context.quotedMessageType == "conversation") {
        const match = message.match(/^s\/(.*)\/(.*)(\/|)([gimuy]*)$/);
        if (!match) {
            return await context.replyText('fuck me! invalid pattern', {});
        }
        const [_, from, to, flags] = match;
        console.log(from);
        const re = new RegExp(from, flags);
        const subst = context.quotedMessage.message.conversation.replace(re, to);
        const quoted: any = (await bot.loadMessage(context));
        console.log(subst);
        if (quoted) {
            const options = {
                quoted: quoted.originalMessage
            }
            return bot.sendTextMessage(context, subst, options);
        }
        return context.replyText(subst, {});
    }
}

export {
    sed,
};
