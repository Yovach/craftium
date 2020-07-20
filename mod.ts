import { PaperVersions } from "./src/paper.d.ts";
import { downloadLatestVersion, paperAPI } from "./src/utils.ts";

import { parse } from 'https://deno.land/std/flags/mod.ts';
const parsedArgs = parse(Deno.args);

if (parsedArgs.setup) { // download and setup server files
    const paper = <PaperVersions>await paperAPI('/').then((res) => res.json())
    let version = parsedArgs.setup;
    const availableVersions = paper.versions;
    if (typeof version === 'boolean' || !availableVersions.includes(version)) {
        version = availableVersions[0]
        console.warn('Version not specified or invalid, last version (' + version + ') selected.')
    }

    try {
        Deno.removeSync("tmp", {
            recursive: true
        })
    } catch (e) {
        console.error(e.message)
    }

    try {
        Deno.mkdirSync("tmp")
        console.log("Temp directory created!")
    } catch (e) {
        console.error(e.message)
    }

    console.log(`Downloading paper.jar (${version})..`);
    try {
        Deno.mkdirSync("./server/")
    } catch(e) {
        console.error(e.message)
    }
    const paperBuild = await downloadLatestVersion(version);
    Deno.writeTextFileSync("./paper.json", JSON.stringify({
        version,
        paperBuild
    }))
    console.log(`Downloading complete !`)
} else {
    console.error("An error occured, please specify a valid instruction.")
    Deno.exit(1)
}