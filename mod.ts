import { PaperVersions, CraftiumArgs } from "./src/paper.d.ts";
import {
    downloadLatestVersion,
    paperAPI,
    checkUpdate,
    resetTmpDir,
    cleanup,
    isReady,
    removeIfExists,
} from "./src/utils.ts";

import { parse } from "https://deno.land/std/flags/mod.ts";
import { setupWorkplace } from "./src/helpers.ts";
const parsedArgs = <CraftiumArgs>parse(Deno.args);

if (parsedArgs.setup) { // download and setup server files
    await setupWorkplace(parsedArgs);
} else if (parsedArgs.update) {
    if (!isReady()) {
        console.error("Project not ready, initialization of the workplace..");
        await setupWorkplace(parsedArgs);
    } else {
        const updated = await checkUpdate();
        if (updated) {
            console.log("The new update was downloaded.");
        } else {
            console.log("No updates were found.");
        }
    }
} else if (parsedArgs.launch) {
    if (!isReady()) {
        console.error("Please make a setup before update.");
        Deno.exit(1);
    }
    Deno.chdir('server')
} else if (parsedArgs.cleanup) {
    if (cleanup()) {
        console.info("Temporary files has been removed");
    }
} else {
    console.error("An error occured, please specify a valid instruction.");
    Deno.exit(1);
}
