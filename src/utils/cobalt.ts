import axios from "axios";

export interface CobaltErrorContext {
    service: string;
    limit: number;
}

export interface CobaltError {
    code: number;
    context: CobaltErrorContext;
}

export interface PickerResponse {
    type: 'photo' | 'video' | 'gif';
    url: string;
    thumb?: string;
}

export interface CobaltResponse {
    status: "error" | "picker" | "tunnel" | "redirect";
    url?: string;
    filename?: string;
    audio?: string;
    audioFilename?: string;
    picker?: PickerResponse[];
    error?: CobaltError;
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
            url: "http://cobalt.kamuridesu.com",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Api-Key " + process.env.COBALT_API_KEY
            },
            data: {
                filenameStyle: "basic",
                url: fetchURL,
                downloadMode: kind == "audio" ? "audio" : "auto",
                videoQuality: quality.toString()
            },
            responseType: "json"
        });
        return req.data;
    } catch (e) {
        console.log((e as any).toJSON());
        return null;
    }
}

export async function downloadMedia(fetchURL: string, kind: "video" | "audio" = "video", quality: number = 360): Promise<Result | null> {
    const media = await getCobaltStreamURL(fetchURL, kind, quality);
    if (media === null) {
        throw new Error("Could not fetch media from cobalt!");
    }
    if (media.status == "error") {
        throw new Error(media.error?.context.service);
    }

    if (media.status == "picker") {
        throw new Error("Invalid media URL!");
    }

    try {
        const req = await axios({
            url: media.url,
            responseType: "arraybuffer"
        });
        return {
            blob: req.data,
            filename: media.filename ? media.filename : "media." + (kind == "video" ? "mp4" : "mp3")
        };
    } catch (e) {
        console.log((e as any).request.data);
        return null;
    }
}

async function debug() {
    const url = "https://www.youtube.com/watch?v=2JE8R9KfJwI";
    const media = await getCobaltStreamURL(url);
    console.log(media);
}

// (async () => {
//     await debug();
// })();