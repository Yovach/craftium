import {PaperLatestVersion} from "./paper.d.ts";

const ENDPOINT = 'https://papermc.io/api/v1/paper';

const REGEX_VERSION = new RegExp("filename=paper-(\\d+).jar")

export function paperAPI(route = "/"): Promise<Response> {
    return fetch(ENDPOINT + route)
}

export async function paperLatestVersion(version: string) {
    const request = await paperAPI(`/${version}/latest`);
    return <PaperLatestVersion>await request.json();
}

/**
 * Download the latest version of Paper.jar (for a specified Minecraft version)
 */
export async function downloadPaper(version: string) {
    Deno.chdir("tmp")
    const tmpFile = await Deno.makeTempFile({
        dir: Deno.cwd(),
        prefix: 'paper_',
        suffix: '.jar'
    });
    const serverFile = await paperAPI(`/${version}/latest/download`);
/*    let paperBuild;
    const contentDisposition = serverFile.headers.get('content-disposition');
    if (contentDisposition) {
        const regExpExecArray = REGEX_VERSION.exec(contentDisposition)
        if (regExpExecArray && regExpExecArray.length === 2) {
            paperBuild = regExpExecArray[1]
        } else {
            throw new Error("Invalid parsing of build version !")
        }
    } else {
        const request = await paperAPI(`/${version}/latest`);
        const latestVersion = <PaperLatestVersion>await request.json();
        paperBuild = latestVersion.build;
    }*/
    const body = new Uint8Array(await serverFile.arrayBuffer());
    await Deno.writeFile(tmpFile, body)
    Deno.chdir("../");
    Deno.copyFileSync(tmpFile, "./server.jar")
    await Deno.remove(tmpFile)
}