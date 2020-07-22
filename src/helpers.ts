import { paperAPI, removeIfExists, downloadLatestVersion } from "./utils.ts";
import { PaperVersions, CraftiumArgs } from "./paper.d.ts";
import Application from "./application.ts";

export async function setupWorkplace(parsedArgs: CraftiumArgs) {
  const application = Application.getInstance();
  const paper = <PaperVersions> await paperAPI("/").then((res) => res.json());
  let version = parsedArgs.setup ?? parsedArgs.update ?? parsedArgs.launch;
  if (typeof version === "undefined") {
    console.error("An error occured.");
    Deno.exit(1);
  }
  const availableVersions = paper.versions;
  if (typeof version === "boolean" || !availableVersions.includes(version)) {
    version = availableVersions[0];
    console.warn(
      "Version not specified or invalid, last version (" + version +
        ") selected.",
    );
  }

  removeIfExists("./tmp/");
  removeIfExists("./server/");
  removeIfExists("paper.json");

  console.log(`Downloading paper.jar (${version})..`);
  Deno.mkdirSync("./tmp/");
  Deno.mkdirSync("./server/");

  Deno.writeFileSync(
    "./server/eula.txt",
    application.getEncoder().encode("eula=true"),
  );
  await downloadLatestVersion(version);
  console.log(`Downloading complete.`);
}
