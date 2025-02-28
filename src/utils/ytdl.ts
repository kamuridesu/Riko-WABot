import axios, { AxiosResponse } from "axios";


function getFileName(req: AxiosResponse<any, any>, kind: "audio" | "video"): string {
    const header: string | undefined = req.headers["Content-Disposition"];
    if (!header) {
        return "unknown" + (kind == "video" ? "mp4" : "mp3");
    }
    return header.split("filename=")[1].split(";")[0];
}

export async function ytdl(videoUrl: string, kind: "audio" | "video") {
    const url = `https://api.kamuridesu.com/api/ytdl/?url=${videoUrl}&kind=${kind}`;
    try {
        const req = await axios({
            method: "GET",
            url: url,
            responseType: "arraybuffer"
        });
        return {
            blob: req.data,
            filename: getFileName(req, kind)
        };
    } catch (e) {
        console.log("Fail to get media, err is " + e);
        return null;
    }
}
