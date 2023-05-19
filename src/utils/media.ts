import pkgff from "fluent-ffmpeg";
const ffmpeg = pkgff;

import * as fs from "fs/promises";

function processSync(media: string, outFileName: string){
    return new Promise<void>((resolve,reject)=>{
        ffmpeg()
        .input(media)
        .format("ogg")
        .audioCodec("opus")
        .audioChannels(1)
        .addOutputOptions('-avoid_negative_ts make_zero')
        .save(outFileName)
        .on("end", () => {
          return resolve();
        })
        .on("error", (err) => {
            return reject(err);
        });
    });
}

export async function convertToOpus(media: ArrayBuffer) {
  const randomFilename = `temp/music${Math.random() * 10000}.mp3`;
  const outputFileName = `temp/music${Math.random() * 10000}.opus`;

  await fs.writeFile(randomFilename, Buffer.from(media));

  try {
    await processSync(randomFilename, outputFileName);
    const content = await fs.readFile(outputFileName);

    await fs.unlink(randomFilename);
    await fs.unlink(outputFileName);
    return content;

  } catch (err) {
    console.log(err);
    await fs.unlink(randomFilename);
    return media;
  }
}
