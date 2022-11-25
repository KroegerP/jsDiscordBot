const { SlashCommandBuilder } = require('discord.js');

const url = "https://www.affirmations.dev";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('affirm')
		.setDescription('Gives you encouragement!'),
	async execute(interaction) {
		await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then((response) => response.json()).then((data) => {
            const myAffirmation = data;
            console.log("MYAFFIRMATION",myAffirmation)
            interaction.reply(myAffirmation.affirmation);
        });
	},
};