import { PaperLatestVersion } from "./paper.d.ts";

const ENDPOINT = "https://papermc.io/api/v1/paper";

// const REGEX_VERSION = new RegExp("filename=paper-(\\d+).jar");

export function paperAPI(route = "/"): Promise<Response> {
  return fetch(ENDPOINT + route);
}

export async function fetchLatestVersion(version: string) {
  const request = await paperAPI(`/${version}/latest`);
  return <PaperLatestVersion> await request.json();
}

/**
 * Download the latest version of Paper.jar (for a specified Minecraft version)
 */
export async function downloadLatestVersion(version: string) {
  Deno.chdir("tmp");
  const tmpFile = Deno.makeTempFileSync({
    dir: Deno.cwd(),
    prefix: "paper_",
    suffix: ".jar",
  });
  const serverFile = await paperAPI(`/${version}/latest/download`);
  const body = new Uint8Array(await serverFile.arrayBuffer());
  Deno.writeFileSync(tmpFile, body);
  Deno.chdir("../");
  Deno.copyFileSync(tmpFile, "./server/server.jar");
  Deno.remove(tmpFile);
  Deno.writeTextFileSync(
    "./paper.json",
    JSON.stringify(
      await fetchLatestVersion(version),
    ),
  );
}

export async function checkUpdate() {
  const decoder = new TextDecoder("utf-8");
  const file = Deno.readFileSync("paper.json");
  const { build: currentBuild, version } = <PaperLatestVersion> JSON.parse(
    decoder.decode(file),
  );
  const { build: latestBuild } = await fetchLatestVersion(version);
  if ((+currentBuild) < (+latestBuild)) {
    console.log("New update available, downloading..");
    await downloadLatestVersion(version);
    return true;
  }
  return false;
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

export function resetTmpDir() {
  try {
    Deno.mkdirSync("tmp");
    console.log("Temp directory created!");
  } catch (e) {
    console.error(e.message);
  }
}

/* Cleanup the tmp directory */
export function cleanup() {
  try {
    Deno.removeSync("tmp", {
      recursive: true,
    });
    return true;
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      console.error(e.message);
    }
  }
  return false;
}
