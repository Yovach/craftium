import { PaperVersions, CraftiumArgs } from "./src/paper.d.ts";
import {
    checkUpdate,
    cleanup,
    isReady,
} from "./src/utils.ts";

import { parse } from "https://deno.land/std/flags/mod.ts";

import { setupWorkplace } from "./src/helpers.ts";
const parsedArgs = <CraftiumArgs>parse(Deno.args);

if (parsedArgs.update) {
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
        await setupWorkplace(parsedArgs);
    }
    Deno.chdir("server");
    console.log('Running server..')
    const p = Deno.run({
        cmd: [
            "java",
            "-jar",
            "server.jar",
            "-nogui"
        ],
        stdout: "piped",
        stderr: "piped",
        stdin: "piped"
    });
    const { code } = await p.status();
    if (code === 0) {
        const rawOutput = await p.output();
        await Deno.stdout.write(rawOutput);
    } else {
        const rawError = await p.stderrOutput();
        const errorString = new TextDecoder().decode(rawError);
        console.log(errorString);
    }

    Deno.exit(code);
} else if (parsedArgs.cleanup) {
    if (cleanup()) {
        console.info("Temporary files has been removed");
    }
} else {
    console.error("An error occured, please specify a valid instruction.");
    Deno.exit(1);
}
