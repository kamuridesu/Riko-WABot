import * as funcs from "./chatsImpl.js";


async function chatsHandler(bot, message, context, group, metadata) {
    if (/(s\/(?:\\S|[^/])+\/(?:\\S|[^/])(?:\/[gimyus]+)?)/.test(message)) {
        funcs.sed(bot, message, context);
    }
}

export {
    chatsHandler
};
