const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');

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
		const cml = JSON.parse(fs.readFileSync('lists/movies.json'));
		fs.writeFileSync(`lists/list_backup/${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.json`, JSON.stringify(cml), { flag: 'w' });
		fs.writeFileSync('lists/movies.json', JSON.stringify({}), { flag: 'w' });
		interaction.editReply(`The movie list has been cleared.`);
	},
};