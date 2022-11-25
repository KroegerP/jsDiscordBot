const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('The Bot will join the current voice channel'),
	async execute(interaction) {
		const user = await interaction.member.fetch();
			console.log(user);
			voiceConnection = joinVoiceChannel({
				channelId: user.voice.channelId,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			}); 
		interaction.reply(`Joining ${voiceChannel.name}`);
	},
};