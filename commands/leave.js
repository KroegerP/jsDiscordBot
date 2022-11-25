const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, entersState, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('The Bot will join the current voice channel'),
	async execute(interaction) {
		const curConnection = getVoiceConnection(interaction.guild.id);

		if(curConnection) {
			const dc = getVoiceConnection(interaction.guild.id).destroy();
			interaction.reply(`Leaving ${interaction.channel.name}`)
		} else console.log("ERROR: No connection found!")
		
	},
};