const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, entersState, getVoiceConnection, VoiceConnectionStatus, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const Downloader = require('../utils/downloader');
const ytdl = require('ytdl-core');
const fs = require('fs');
//Configure YoutubeMp3Downloader with your settings

function PlayRequestedAudio() {
	
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('theme')
		.setDescription('Plays a given youtube url')
		.addStringOption(option =>
            option
				.setName('link-or-url')
                .setDescription('The url dummy')
                .setRequired(true))
		.addChannelOption((option) => 
			option
				.setName('channel')
				.setDescription('The channel to join')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildVoice)),
	async execute(interaction) {
		const voiceChannel = interaction.options.getChannel('channel');
		const my_url = interaction.options.get('link-or-url').value;
		const myVideoId = my_url.split('?v=')[1];
		// console.log(myVideoId);
		// console.log(my_url);
		outputPath = './audioPlayer/' + interaction.user.username.toString();
		// const YD = new YoutubeMp3Downloader({
		// 	"ffmpegPath": "~/ffmpeg-5.1.1",        // FFmpeg binary location
		// 	"outputPath": outputPath,    // Output file location (default: the home directory)
		// 	"youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
		// 	"queueParallelism": 2,                  // Download parallelism (default: 1)
		// 	"progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
		// 	"allowWebm": false                      // Enable download from WebM sources (default: false)
		// });
		// ytdl(my_url).pipe(fs.createWriteStream('video.mp3'));
		const curConnection = getVoiceConnection(interaction.guild.id);
		let voiceConnection;
		const finalPath = outputPath + '/mySong.mp3';

		console.log(finalPath, fs.existsSync(finalPath));

		if (fs.existsSync(finalPath)) {
			console.log("DIRECTORY EXISTS, PLAYING SONG")
			if(curConnection) {
				voiceConnection = curConnection;
			} else {
				voiceConnection = joinVoiceChannel({
					channelId: voiceChannel.id,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				}); 
			}
			
			voiceConnection.on(VoiceConnectionStatus.Ready, () => {
				console.log('The connection has entered the Ready state - ready to play audio!');
			});

			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});
			
			player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
				console.log('Audio player is in the Playing state!');
			});

			player.on('error', error => {
				console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
			});

			const resource = createAudioResource(finalPath, {
				metadata: {
					title: 'A good song!',
				},
			});

			player.play(resource);

			voiceConnection.subscribe(player);
		}

		const downloader = new Downloader(outputPath=outputPath);
		var i = 0;
		downloader.getMP3({videoId: myVideoId, name: 'mySong.mp3'}, function(err,res){
			i++;
			if(err)
				throw err;
			else{
				console.log("Song "+ i + " was downloaded: " + res.file);

				// console.log("CONNECTION", curConnection);
				console.log(interaction.channelId)

				// TODO: Cover case in which the bot is connected to another VC in a guild
				if(curConnection) {
					voiceConnection = curConnection;
				} else {
					voiceConnection = joinVoiceChannel({
						channelId: voiceChannel.id,
						guildId: interaction.guild.id,
						adapterCreator: interaction.guild.voiceAdapterCreator,
					}); 
				}
				
				voiceConnection.on(VoiceConnectionStatus.Ready, () => {
					console.log('The connection has entered the Ready state - ready to play audio!');
				});

				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Pause,
					},
				});
				
				player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
					console.log('Audio player is in the Playing state!');
				});

				player.on('error', error => {
					console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
				});

				const resource = createAudioResource(finalPath, {
					metadata: {
						title: 'A good song!',
					},
				});

				player.play(resource);

				voiceConnection.subscribe(player);
			}
		});
	},
};