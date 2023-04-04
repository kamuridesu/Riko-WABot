async function sed(bot, message, context) {
    if (context.hasQuotedMessage && context.quotedMessageType == "conversation") {
        const match = message.match(/^s\/(.*)\/(.*)(\/|)([gimuy]*)$/);
        if (!match) {
            return await bot.replyText('fuck me! invalid pattern');
        }
        const [_, from, to, flags] = match;

        const re = new RegExp(from, flags);
        const subst = context.quotedMessage.message.conversation.replace(re, to);
        const quoted = (await bot.loadMessage(context))
        if (quoted) {
            const options = {
                quoted: quoted.originalMessage
            }
            return bot.sendTextMessage(context, subst, options);
        }
        return bot.replyText(context, subst);
    }
}


export {
    sed,
};
