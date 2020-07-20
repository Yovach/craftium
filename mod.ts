import { PaperVersions, PaperLatestVersion } from "./src/paper.d.ts";
import { downloadLatestVersion, paperAPI, fetchLatestVersion, checkUpdate, resetTmpDir, cleanup } from "./src/utils.ts";

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

    resetTmpDir();

    console.log(`Downloading paper.jar (${version})..`);
    try {
        // we create "server" directory if not exists
        Deno.mkdirSync("./server/")
    } catch (e) {
        console.error(e.message)
    }
    await downloadLatestVersion(version);
    console.log(`Downloading complete.`);
} else if (parsedArgs.update) {
    try {
        Deno.statSync('paper.json');
    } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
            console.error("Please make a setup before update.");
            Deno.exit(1);
        } else {
            throw e;
        }
    }
    const updated = await checkUpdate();
    if (updated) {
        console.log('The new update was downloaded.')
    } else {
        console.log('No updates were found.')
    }
} else if (parsedArgs.cleanup) {
    if (cleanup()) {
        console.info('Temporary files has been removed') 
    }
} else {
    console.error("An error occured, please specify a valid instruction.")
    Deno.exit(1)
}