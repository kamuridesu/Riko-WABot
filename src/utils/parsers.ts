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
    let title: string = "";
    let episode: string = "";
    let season: string = "";
    let messageArray = message.split(" ");
    const seasonAndEpisode = messageArray.find(s => /s[0-9]+e[0-9]+/.test(s))
    title = messageArray.filter(e => e != seasonAndEpisode).join(" ");
    if (seasonAndEpisode) {
        const [s, e] = seasonAndEpisode.split("e");
        season = s.replace("s", "");
        episode = e;
    }
    const intSeason = parseInt(season);
    const intEpisode = parseInt(episode);
    return {
        title,
        season: intSeason,
        episode: intEpisode
    }
}
