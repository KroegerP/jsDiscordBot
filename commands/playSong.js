const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, getVoiceConnection, VoiceConnectionStatus, createAudioResource } = require('@discordjs/voice');
const Downloader = require('../utils/downloader');
const ytdl = require('ytdl-core');
const fs = require('fs');
const axios = require('axios');
const { youtube } = require('scrape-youtube');
//Configure YoutubeMp3Downloader with your settings

function PlayRequestedAudio() {
	
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a given youtube url')
		// .addStringOption(option =>
        //     option
		// 		.setName('link-or-url')
        //         .setDescription('The url dummy')
        //         .setRequired(true))
		.addStringOption(option =>
					option
						.setName('youtube-search')
						.setDescription('The song name dummy')
						.setRequired(true)),
	async execute(interaction) {
		// const my_url = interaction.options.get('link-or-url').value;
		const mySearch = interaction.options.get('youtube-search').value;
		// const myVideoId = my_url.split('?v=')[1];
		// console.log(myVideoId);
		// console.log(my_url);
		// const songInfo = await ytdl.getBasicInfo(my_url);

		const { videos } = await youtube.search(mySearch);

		// console.log(videos);
		console.log(videos[0]);
		const firstVideo = videos[0];
		const myVideoId2 = firstVideo.link.split('/')[3];
		console.log(firstVideo.link.split('/'));
		console.log(myVideoId2);

		// console.log(searchResults);

		// console.log(songInfo.videoDetails.title);
		outputPath = './audioPlayer';
		// ytdl(my_url).pipe(fs.createWriteStream('video.mp3'));
		const curConnection = getVoiceConnection(interaction.guild.id);
		let voiceConnection;
		const finalPath = outputPath + '/' + firstVideo.title + '.mp3';

		const player = createAudioPlayer();
		player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
			console.log('Audio player is in the Playing state!');
		});

		player.on('error', error => {
			console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
		});

		console.log(finalPath, fs.existsSync(finalPath));

		await interaction.deferReply();

		if (fs.existsSync(finalPath)) {
			// Do code 
			const resource = createAudioResource(finalPath, {
				metadata: {
					title: 'A good song!',
				},
			});

			// TODO: Cover case in which the bot is connected to another VC in a guild
			if(curConnection) {
				voiceConnection = curConnection;
			} else {
				const user = await interaction.member.fetch();
				console.log(user);
				voiceConnection = joinVoiceChannel({
					channelId: user.voice.channelId,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				}); 
			}

			voiceConnection.subscribe(player);
			
			voiceConnection.on(VoiceConnectionStatus.Ready, () => {
				console.log('The connection has entered the Ready state - ready to play audio!');
				
			});

			player.play(resource);
			await interaction.editReply(`Playing ${firstVideo.title}!`);
		}
		else {
		
			const downloader = new Downloader(outputPath=outputPath);
			
			var i = 0;
			
			downloader.getMP3({videoId: myVideoId2}, async function(err,res){
				i++;
				if(err)
					throw err;
				else{
					console.log("Song "+ i + " was downloaded: " + res.file);

					console.log("CONNECTION", curConnection);
					// console.log(interaction.channelId);

					const resource = createAudioResource(finalPath, {
						metadata: {
							title: 'A good song!',
						},
					});

					// TODO: Cover case in which the bot is connected to another VC in a guild
					if(curConnection) {
						voiceConnection = curConnection;
					} else {
						const user = await interaction.member.fetch();
						console.log(user);
						voiceConnection = joinVoiceChannel({
							channelId: user.voice.channelId,
							guildId: interaction.guild.id,
							adapterCreator: interaction.guild.voiceAdapterCreator,
						}); 
					}

					voiceConnection.subscribe(player);
					
					voiceConnection.on(VoiceConnectionStatus.Ready, () => {
						console.log('The connection has entered the Ready state - ready to play audio!');
						
					});

					player.play(resource);
					await interaction.editReply(`Downloading ${firstVideo.title}...`);
				}
			});
		// await interaction.reply(`Downloading ${songInfo.videoDetails.title}...`);
		}
	},
};