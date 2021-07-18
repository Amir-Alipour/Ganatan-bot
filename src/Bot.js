// env file for hidden keys
require('dotenv').config();

// axios for manage HTTP requests
const axios = require('axios').default;

// for get video IDs from a query at youtube
const usetube = require("usetube");

//  for better connection to discord Api with JS
const {Client} = require('discord.js');
const client = new Client();
client.login(process.env.TOKEN);

const cmd = "$" // starter command for know when user call BOT

client.on("ready", () => {
    console.log("BOT is ready!");
})

client.on("message", async (message) => {
    if(message.author.bot) return;

    if(message.content.toLocaleLowerCase() === "ganatan"){
        message.reply(`What you need boss ${"https://emoji.gg/assets/emoji/6308-cow-roll.gif"}`);
    }

    if(message.content.startsWith(cmd)){
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(cmd.length)
            .split(/\s+/);

        switch (CMD_NAME){
            case "cmd": {
                message.reply(`Ganatan Commands :
                    ${'`$p (song name | artist and song)`'} : play song
                    ${'`$s or $stop`'} : pause the song
                    ${'`$r`'} : resume the song
                    ${'`$mute and $unmute`'} : mute or unmute the Ganatan
                    ${'`$vol (up | down)`'} : increase or decrease volume
                    ${'`$dis`'} : disconnect Ganatan
                `);
                break;
            }

            

            default: {
                message.reply("I don't know this command");
            }
        }
    }
})