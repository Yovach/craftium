import { CraftiumArgs } from "./src/paper.d.ts";
import {
  checkUpdate,
  cleanup,
  isReady,
} from "./src/utils.ts";

import { setupWorkplace } from "./src/helpers.ts";
import Application from "./src/application.ts";
import { parse } from "./src/libs.ts";
const parsedArgs = <CraftiumArgs> parse(Deno.args);

const app = Application.getInstance();
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
  console.log("Running server..");

  const status = await app.startServer();
  console.log(status.code);
} else if (parsedArgs.cleanup) {
  if (cleanup()) {
    console.info("Temporary files has been removed");
  }
} else {
  console.error("An error occured, please specify a valid instruction.");
  Deno.exit(1);
}
