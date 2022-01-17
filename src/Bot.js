// env file for hidden keys
require("dotenv").config();

// axios for manage HTTP requests
const axios = require("axios").default;

// for get video IDs from a query at youtube
const usetube = require("usetube");

//  for better connection to discord Api with JS
const { Client, MessageEmbed, MessageButton, MessageActionRow, Intents } = require("discord.js");
const {createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice')
const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
	] 
});
client.login(process.env.TOKEN);

// the BOT buttons library

const cmd = "$"; // starter command for know when user call BOT

const player = createAudioPlayer();

client.on("ready", () => {
    console.log("BOT is ready!");
});

client.on("messageCreate", async (message) => {
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
                    ${"`$clear 1-100`"} : clear chat
                    ${"`$kick @user`"} : kick user
                    ${"`$inv`"} : generate invite link
                    ${"`$me`"} : get your information
                    ${"`$avatar`"} : get your avatar
                    ${"`$discord`"} : get discord avatars
                    -------------------------
                    ${"`$p (anything or link)`"} : play song
                    ${"`$s or $stop`"} : pause the song
                    ${"`$r`"} : resume the song
                    ${"`$dis`"} : disconnect Ganatan
                    -------------------------
                    ${"`$share`"} : Ganatan's link for share it
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
                                url: "https://youtube-mp36.p.rapidapi.com/dl",
                                params: {
                                    id: song.id,
                                },
                                headers: {
                                    "x-rapidapi-key": process.env.KEY,
                                    "x-rapidapi-host":
                                        "youtube-mp36.p.rapidapi.com",
                                },
                            })
                            .then(({data}) => {
                                const member = message.guild.members.cache.get(message.author.id);

                                const playingSong = new MessageEmbed()
                                .setColor("ffffff")
                                .setTitle(song.original_title)
                                .setURL(`https://www.youtube.com/watch?v=${song.id}`)
                                .setDescription(`**[${member}]**, enjoy it ™`)

                                const action_btns = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('pr')
                                            .setLabel("Pause / Resume")
                                            .setStyle('SUCCESS')
                                    )
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('stop')
                                            .setLabel('Stop')
                                            .setStyle('DANGER')
                                    )

                                message.channel.send({content: null, ephemeral: true, embeds: [playingSong], components: [action_btns]})
                                const collector = message.channel.createMessageComponentCollector();
                               
                                const connection = joinVoiceChannel({
                                    channelId: message.channel.id,
                                    guildId: message.channel.guild.id,
                                    adapterCreator: message.channel.guild.voiceAdapterCreator
                                })
                                connection.subscribe(player);

                                connection.on(VoiceConnectionStatus.Ready, () => {
                                    const source = createAudioResource(data.link);
                                    player.play();

                                    collector.on('collect', async i => {
                                        if(i.customId === "pr"){
                                            if(AudioPlayerStatus.Paused) {
                                                player.unpause()
                                                inta.message.reply("song playing again ...")
                                            } else {
                                                player.pause()
                                                inta.message.reply("song paused!!")
                                            }
                                        }
                                    })

                                    collector.on('collect', async i => {
                                        if(i.customId === "stop"){
                                            connection.destroy();
                                        }
                                    })


                                    client.on("messageCreate", msg => {
                                        if(msg.author.bot) return;

                                        if(msg.content.startsWith(cmd)){
                                            const [CMD_NAME, ...args] = msg.content
                                            .trim()
                                            .substring(cmd.length)
                                            .split(/\s+/);

                                            switch (CMD_NAME) {
                                                case "link": {
                                                    msg.reply(`https://www.youtube.com/watch?v=${song.id}`);
                                                }

                                                case "s":
                                                case "stop": {
                                                    player.pause();

                                                    setTimeout(() => {
                                                        if(AudioPlayerStatus.Paused){
                                                            connection.destroy();
                                                        }
                                                    }, 600000);

                                                    break;
                                                }

                                                case "r": {
                                                    player.unpause();
                                                    break;
                                                }

                                                case "dis": {
                                                    connection.destroy();
                                                    msg.react("👋");
                                                    break;
                                                }

                                                default: {
                                                    return;
                                                }
                                            }
                                        }
                                    })
                                })

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
                        .catch(() => message.reply("I don't have permissions for do it :("));
                    }
                }else {
                    message.reply("Enter number 1 - 100 first!");
                }

                break;
            }
            // -------------------------
            // -------------------------

            case "kick": {
                if(!message.member.hasPermission("KICK_MEMBERS")){
                    return message.reply("Yout don't have permissions !!!");
                };

                if (args.length === 0) return message.reply("Please Tag an User");

                const userID = args[0].match(/(\d+)/);
                const member = message.guild.members.cache.get(
                    userID ? userID[0] : args[0]
                )

                if(member){
                    member.kick()
                    .then(member => {
                        message.channel.send(`${member} was **K I C K E D**`);
                    })
                    .catch(() => message.reply("I don't have permissions for kick anyone :("))
                }else {
                    message.reply("That member not found!");
                }

                break;
            }
            // -------------------------
            // -------------------------

            case "avatar": {
                message.reply(message.author.displayAvatarURL());

                break;
            }
            // -------------------------
            // -------------------------

            case "me": {
                const {author} = message;
                message.reply(`You're ${author.username} with (${author.id}) ID`);

                break;
            }
            // -------------------------
            // ------------------------

            case "discord": {
                message.channel.send(`
                https://cdn.discordapp.com/embed/avatars/1.png
                https://cdn.discordapp.com/embed/avatars/2.png
                https://cdn.discordapp.com/embed/avatars/3.png
                https://cdn.discordapp.com/embed/avatars/4.png
                https://cdn.discordapp.com/embed/avatars/5.png
                `);

                break;
            }
            // -------------------------
            // ------------------------

            case "inv": {
                message.channel.createInvite().then(res => {
                    message.reply(`https://discord.gg/${res.code}`);
                }).catch(err => console.log(err))

                break;
            }
            // -------------------------
            // ------------------------

            case "share": {
                message.reply("https://discord.com/oauth2/authorize?client_id=866251163963752478&scope=bot");

                break;
            }

            case "cow": {
                message.reply("**M O O O W**");

                break;
            }

        }
    }
});



client.on('messageReactionAdd', (reaction, user) => {
    const member = reaction.message.guild.members.cache.get(user.id);

    const {name} = reaction.emoji;
    if(name === "🐮" || name === "🐄"){
        reaction.message.channel.send(`${member.user.username} you Call me? need anything?`);
    }
})
// reaction to anyone add cow react to any message
