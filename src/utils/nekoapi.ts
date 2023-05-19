import {NekosAPI} from "nekosapi/v3/index.js";
import { Socks5Proxy } from "./config.js";
import { SocksProxyAgent } from "socks-proxy-agent";
import axios, { AxiosResponse } from "axios";
import { IMessage } from "@kamuridesu/whatframework/@types/message.js";
import { Emojis } from "./emoji.js";

function checkResponseCode(response: AxiosResponse<any, any>) {
    if ((response.status > 200 && response.status <= 300)) {
        throw new Error(`An error occurred while fetching data from the server. ${response.statusText}. Status: ${response.status}. ${response.request?.url}`)
    }
}

export async function fetchResponse<T>(url: URL, responseAsBytes = false): Promise<T> {
    const proxy = process.env.PROXY_HOST != undefined ? Socks5Proxy : false;
    let agent: SocksProxyAgent | undefined;
    if (proxy) {
        const proxyURL = `${proxy.protocol}://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`;
        agent = new SocksProxyAgent(proxyURL);
    }
    const response = await axios.get(
        url.toString(),
        {
            httpsAgent: agent,
            responseType: responseAsBytes ? "arraybuffer" : "json"
        }
    )
    checkResponseCode(response);
    return <T> await response.data;
}

export class NekosAPIAxiosProxy extends NekosAPI {
    constructor() {
        super();
        (this as any).checkResponseCode = checkResponseCode;
        (this as any).fetchResponse = fetchResponse;
    }
}


export async function getRandomImageFromApi(message: IMessage, api: NekosAPIAxiosProxy) {
    await message.react(Emojis.searching);
    try {
        const image = await api.getRandomImage();
        const webpImage: any = await fetchResponse(new URL(image.image_url), true);
        await message.replyMedia(webpImage, "image", "");
        await message.react(Emojis.success);
    } catch (e) {
        await message.replyText("Algo deu errado!");
        await message.react(Emojis.fail);
    }
}
