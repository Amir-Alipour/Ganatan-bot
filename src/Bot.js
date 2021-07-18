// env file for hidden keys
require("dotenv").config();

// axios for manage HTTP requests
const axios = require("axios").default;

// for get video IDs from a query at youtube
const usetube = require("usetube");

//  for better connection to discord Api with JS
const { Client } = require("discord.js");
const client = new Client();
client.login(process.env.TOKEN);

const cmd = "$"; // starter command for know when user call BOT

client.on("ready", () => {
    console.log("BOT is ready!");
});

client.on("message", async (message) => {
    if (message.author.bot) return;

    if (message.content.toLocaleLowerCase() === "ganatan") {
        message.reply(
            `What you need boss ${"https://emoji.gg/assets/emoji/6308-cow-roll.gif"}`
        );
    }

    if (message.content.startsWith(cmd)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(cmd.length)
            .split(/\s+/);

        switch (CMD_NAME) {
            case "cmd": {
                message.reply(`Ganatan Commands :
                    ${"`call my name`"} when you wanna know I'm here ..
                    ${"`$p (song name | artist and song)`"} : play song
                    ${"`$s or $stop`"} : pause the song
                    ${"`$r`"} : resume the song
                    ${"`$mute and $unmute`"} : mute or unmute the Ganatan
                    ${"`$vol (up | down)`"} : increase or decrease volume
                    ${"`$dis`"} : disconnect Ganatan
                    -------------------------
                    ${"`$clear 1-100`"} : clear chat 
                `);
                break;
            }
            // cmd for show all Ganatan commands to user
            // ------------------------------
            // ------------------------------
            // ------------------------------

            case "p": {
                if (message.member.voice.channel) {
                    let search;
                    if (args.length < 1) {
                        message.reply("Enter a Song name first!");
                        return;
                    } else if (args.length === 1) {
                        search = args[0];
                    } else {
                        search = args.join(" ");
                    }

                    message.channel.send(`Searching for ${search} ...`);

                    await usetube.searchVideo(search).then( async (videosData) => {
                        if(!videosData){
                            message.reply("Ganatan Not Work | maybe youtube filter on your country!");
                            return;
                        }

                        const song = videosData.videos.filter(
                            (video) =>
                                !video.original_title
                                    .toLowerCase()
                                    .includes(
                                        "reaction" ||
                                            "react" ||
                                            "بررسی" ||
                                            "ری اکشن" ||
                                            "ری اکت"
                                    )
                        )[0];
                        // filter the result from the youtube reactors

                        await axios
                            .request({
                                method: "GET",
                                url: "https://youtube-to-mp32.p.rapidapi.com/yt_to_mp3",
                                params: {
                                    video_id: song.id,
                                },
                                headers: {
                                    "x-rapidapi-key": process.env.KEY,
                                    "x-rapidapi-host":
                                        "youtube-to-mp32.p.rapidapi.com",
                                },
                            })
                            .then(({data}) => {
                                
                                message.member.voice.channel.join()
                                .then(connection => {
                                    message.channel.send(`| **Now Playing** ${song.original_title} |`);

                                    const dispatcher = connection.play(data.Download_url);

                                    client.on("message", msg => {
                                        if(message.author.bot) return;

                                        if(message.content.startsWith(cmd)){
                                            const [CMD_NAME, ...args] = msg.content
                                            .trim()
                                            .substring(cmd.length)
                                            .split(/\s+/);

                                            switch (CMD_NAME) {
                                                case "s":
                                                case "stop": {
                                                    dispatcher.pause();
                                                    break;
                                                }

                                                case "r": {
                                                    dispatcher.resume();
                                                    break;
                                                }

                                                case "vol": {
                                                    if(args[0] === "up"){
                                                        dispatcher.setVolume(1);
                                                    }else if (args[0] === 'down'){
                                                        dispatcher.setVolume(0.5);
                                                    }
                                                    break;
                                                }

                                                case "mute": {
                                                    dispatcher.setVolume(0);
                                                    break;
                                                }
                                                case "unmute": {
                                                    dispatcher.setVolume(1);
                                                    break;
                                                }

                                                case "dis": {
                                                    connection.disconnect();
                                                    break;
                                                }

                                                default: {
                                                    return;
                                                }
                                            }
                                        }
                                    })

                                }).catch(err => console.log("Error from connect to voice channel: " + err))
                            })
                            .catch((err) => console.log("Error from convert video ID to link: " + err));
                    });
                } else {
                    message.reply("You need to join a voice channel first!");
                }

                break;
            }
            // for search the song from youtube and filter that and convert to mp3 link and play it in voice channel
            // ------------------------------
            // ------------------------------
            // ------------------------------

            case "clear": {
                if(args[0]){
                    let count = parseInt(args[0]);
                    if(count < 1 || count > 100) {
                        message.reply("Invalid Count!");
                    }else {
                        message.channel.bulkDelete(count)
                        .then(() => message.channel.send(`> **${count} message deleted!**`))
                        .catch(() => message.reply("I don't have permisions for do it :("));
                    }
                }else {
                    message.reply("Enter number 1 - 100 first!");
                }

                break;
            }
        }
    }
});
