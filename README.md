# Craftium (BETA)

## Introduction

A project that enables people to manage Paper server effectively. You can setup, update and launch your server with only one script.

Therefore, you'll need to install [deno](https://deno.land/), you can find a installation guide on their website.

This project uses the PaperMC API.

---

## Why use Craftium ?

The code is continually being developed, with options for future expansion.
Today you can update the server and run it. This saves you some time when creating a server.

---

## Setup your server

To launch your server on the latest version of Minecraft, you must run this command :

``deno run -A https://raw.githubusercontent.com/Yovach/craftium/master/mod.ts --launch``


If you want to select your Minecraft version, please specify a version like this :

``deno run -A https://raw.githubusercontent.com/Yovach/craftium/master/mod.ts --launch=1.15.2``

---

## Update your server

**WARNING** : You'll need to setup before update.

To update your server, you must run this command :

``deno run -A https://raw.githubusercontent.com/Yovach/craftium/master/mod.ts --update``

## Note

Please take into account that this is not the final version of the project, there may be modifications on the commands or on the whole code.