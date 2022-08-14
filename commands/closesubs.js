const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closesubs')
        .setDescription('Close submissions (Admins only)'),
    async execute(interaction) {
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.reply({ content: 'You do not have permission to use this command.' });
            return;
        }
        global.submitting = false;
        await interaction.reply(`Submissions for the month of ${util.months[new Date().getMonth()]} are now closed!`);
        return;
    },
};