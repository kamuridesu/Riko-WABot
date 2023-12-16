function parseArgument(message: string, argument: string) {
    const messageArray = message.toLowerCase().split(" ");
    const arg = messageArray.find(e => e.includes(argument));
    const msg = messageArray.filter(e => e != arg).join(" ");
    let selectedArg = arg?.split("=").slice(-1)[0];
    return {
        arg: selectedArg,
        message: msg
    }
}


export function parseMessageToNameAndEpisode(message: string) {
    let { arg, message: msg } = parseArgument(message, "ep=");
    if (!arg) {
        throw new Error("Faltando o número do episódio!");
    }
    const epNumber = parseFloat(arg);
    return {
        title: msg,
        ep: epNumber
    };
}

export function parseMessageToModelAndMessage(message: string) {
    let { arg, message: msg } = parseArgument(message, "model=")
    if (!arg) {
        arg = "chatbot"
    }
    return {
        prompt: msg,
        model: arg
    }
}
