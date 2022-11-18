const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a given youtube url')
		.addStringOption(option =>
            option.setName('link-or-url')
                .setDescription('The url dummy')
                .setRequired(true))
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')),
	async execute(interaction) {
		console.log(interaction.options.getString('link-or-url'));
		interaction.reply('Pong!');
	},
};