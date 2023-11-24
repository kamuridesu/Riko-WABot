export function parseMessageToNameAndEpisode(message: string) {
    const messageArray = message.toLowerCase().split(" ");

    const ep = messageArray.find(e => e.includes("ep="));
    if (!ep) {
        throw new Error("Faltando o número do episódio!");
    }

    const title = messageArray.filter(e => e != ep);
    const epNumber = parseFloat(ep.split("=").slice(-1)[0]);

    return {
        title: title.join(" "),
        ep: epNumber
    };
}
