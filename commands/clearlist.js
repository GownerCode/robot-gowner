const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const movieDB = require('../models/movies.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearlist')
		.setDescription('Empties the list for a new month (!WARNING!)'),
	async execute(interaction) {
		await interaction.deferReply();
		if (!util.userHasAdminRights(interaction.member)) {
			await interaction.editReply({ content: 'You do not have permission to use this command.' });
			return;
		}
		movieDB.clearList(interaction.guild);
		await interaction.editReply(`The movie list has been cleared.`);
		return;
	},
};