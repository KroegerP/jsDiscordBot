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
		.setName('play')
		.setDescription('Plays a given youtube url')
		.addStringOption(option =>
            option
				.setName('link-or-url')
                .setDescription('The url dummy')
                .setRequired(true)),
	async execute(interaction) {
		const my_url = interaction.options.get('link-or-url').value;
		const myVideoId = my_url.split('?v=')[1];
		// console.log(myVideoId);
		// console.log(my_url);
		const songInfo = await ytdl.getBasicInfo(my_url);

		console.log(songInfo.videoDetails.title);
		outputPath = './audioPlayer';
		// ytdl(my_url).pipe(fs.createWriteStream('video.mp3'));
		const curConnection = getVoiceConnection(interaction.guild.id);
		let voiceConnection;
		const finalPath = outputPath + '/' + songInfo.videoDetails.title + '.mp3';

		console.log(finalPath, fs.existsSync(finalPath));

		const downloader = new Downloader(outputPath=outputPath);
		var i = 0;
		await interaction.deferReply();
		downloader.getMP3({videoId: myVideoId}, async function(err,res){
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

				const player = createAudioPlayer();

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

				player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
					console.log('Audio player is in the Playing state!');
				});

				player.on('error', error => {
					console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
				});

				player.play(resource);
				await interaction.editReply(`Downloading ${songInfo.videoDetails.title}...`);
			}
		});
		// await interaction.reply(`Downloading ${songInfo.videoDetails.title}...`);
	},
};