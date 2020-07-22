import { EventEmitter } from "./libs.ts";

export default class Application extends EventEmitter {
  private process?: Deno.Process<{
    cmd: string[];
    stdout: "piped";
    stderr: "piped";
    stdin: "piped";
  }>;

  private decoder: TextDecoder = new TextDecoder();
  private encoder: TextEncoder = new TextEncoder();

  private static instance?: Application;

  constructor() {
    super();
  }

  static getInstance() {
    if (!Application.instance) {
      Application.instance = new Application();
    }
    return Application.instance;
  }

  getDecoder() {
    return this.decoder;
  }

  getEncoder() {
    return this.encoder;
  }

  async startServer() {
    this.process = Deno.run({
      cmd: [
        "java",
        "-jar",
        "server.jar",
        "-nogui",
      ],
      stdout: "piped",
      stderr: "piped",
      stdin: "piped",
    });

    // const buffer = new Uint8Array(1);
    // let data;
    // while (data !== null) {
    //     const data = await this.process.stdout.read(buffer);
    //     if (data) {
    //         await Deno.stdout.write(buffer);
    //     }
    // }

    const status = await this.process.status();
    this.process.close();
    return status;
  }
}
