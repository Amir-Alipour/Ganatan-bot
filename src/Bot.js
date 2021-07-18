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

    
})