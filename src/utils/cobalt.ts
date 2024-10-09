import axios from "axios";

export interface CobaltResponse {
    status: "error" | "stream";
    url?: string;
    text?: string;
}

export interface Result {
    blob: ArrayBuffer;
    filename: string;
}

export async function getCobaltStreamURL(fetchURL: string, kind: "video" | "audio" = "video", quality: number = 360): Promise<CobaltResponse | null> {
    if (![144, 240, 360, 480, 720, 1080].includes(quality)) {
        throw new Error("Quality not supported!");
    }
    try {
        const req = await axios({
            method: "post",
            url: "https://api.cobalt.tools/api/json",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: {
                filenamePattern: "basic",
                url: fetchURL,
                isAudioOnly: kind == "audio",
                vQuality: quality.toString()
            },
            responseType: "json"
        });
        return req.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function downloadMedia(fetchURL: string, kind: "video" | "audio" = "video", quality: number = 360): Promise<Result | null> {
    const media = await getCobaltStreamURL(fetchURL, kind, quality);
    if (media === null) {
        throw new Error("Could not fetch media from cobalt!");
    }
    if (media.status == "error") {
        throw new Error(media.text);
    }

    try {
        const req = await axios({
            url: media.url,
            responseType: "arraybuffer"
        });
        const returnData = {
            filename: "",
            blob: req.data
        }
        if (req.headers["content-disposition"]) {
            returnData.filename = req.headers["content-disposition"].split("filename=")[1].split(";")[0].slice(1, -1);
        }
        return returnData;
    } catch (e) {
        console.log(e);
        return null;
    }
}
