# Craftium

## Introduction

A project that enables people to manage Paper server effectively. You can setup, update and launch your server with only one script.

Therefore, you'll need to install [deno](https://deno.land/), you can find a installation guide on their website.

This project uses the PaperMC API.

---

## Setup your server

To setup your server on the latest version of Minecraft, you must run this command :

``deno run --allow-net --allow-write --allow-read https://raw.githubusercontent.com/Yovach/craftium/master/mod.ts --setup``


If you want to select your Minecraft version, please specify a version like this :
``deno run --allow-net --allow-write --allow-read https://raw.githubusercontent.com/Yovach/craftium/master/mod.ts --setup=1.15.2``

---

## Update your server

**WARNING** : You'll need to setup before update.

To update your server, you must run this command :

``deno run --allow-net --allow-write --allow-read https://raw.githubusercontent.com/Yovach/craftium/master/mod.ts --update``