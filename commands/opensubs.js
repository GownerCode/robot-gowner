const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
const util = require('../common/util.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('opensubs')
        .setDescription('Open submissions (Admins only)'),
    async execute(interaction) {
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.reply({ content: 'You do not have permission to use this command.' });
            return;
        }
        global.submitting = true;
        await interaction.reply(`Submissions for the month of ${months[new Date().getMonth()]} are now open!`);
        return;
    },
};