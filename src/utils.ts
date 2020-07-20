import { PaperLatestVersion } from "./paper.d.ts";

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
    const tmpFile = Deno.makeTempFileSync({
        dir: Deno.cwd(),
        prefix: 'paper_',
        suffix: '.jar'
    });
    const serverFile = await paperAPI(`/${version}/latest/download`);
    const body = new Uint8Array(await serverFile.arrayBuffer());
    Deno.writeFileSync(tmpFile, body)
    Deno.chdir("../");
    Deno.copyFileSync(tmpFile, "./server/server.jar")
    Deno.remove(tmpFile)
    Deno.writeTextFileSync("./paper.json", JSON.stringify(
        await fetchLatestVersion(version),
    ));
}


export async function checkUpdate(version: string) {
    try {
        Deno.statSync('paper.json')
    } catch(e) {
        if (e instanceof Deno.errors.NotFound) {
            console.error("Please make a setup before update.")
            Deno.exit(1)
        } else {
            throw e;
        }
    }
    const paper = Deno.readFileSync('paper.json')
}

export async function exists(filename: string): Promise<boolean> {
    try {
        Deno.stat(filename);
        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            // file or directory does not exist
            return false;
        } else {
            // unexpected error, maybe permissions, pass it along
            throw error;
        }
    }
}