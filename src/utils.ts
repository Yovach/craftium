import {PaperLatestVersion} from "./paper.d.ts";

const ENDPOINT = 'https://papermc.io/api/v1/paper';

const REGEX_VERSION = new RegExp("filename=paper-(\\d+).jar")

export function paperAPI(route = "/"): Promise<Response> {
    return fetch(ENDPOINT + route)
}

export async function fetchLatestVersion(version: string) {
    const request = await paperAPI(`/${version}/latest`);
    return <PaperLatestVersion>await request.json();
}

/**
 * Download the latest version of Paper.jar (for a specified Minecraft version)
 */
export async function downloadLatestVersion(version: string) {
    Deno.chdir("tmp")
    const tmpFile = await Deno.makeTempFile({
        dir: Deno.cwd(),
        prefix: 'paper_',
        suffix: '.jar'
    });
    const serverFile = await paperAPI(`/${version}/latest/download`);
    const body = new Uint8Array(await serverFile.arrayBuffer());
    await Deno.writeFile(tmpFile, body)
    Deno.chdir("../");
    Deno.copyFileSync(tmpFile, "./server/server.jar")
    await Deno.remove(tmpFile)
}