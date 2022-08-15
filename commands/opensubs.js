const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
const util = require('../common/util.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('opensubs')
        .setDescription('Open submissions (Admins only)'),
    async execute(interaction) {
        await interaction.deferReply();
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.followUp({ content: 'You do not have permission to use this command.' });
            return;
        }
        global.submitting = true;
        await interaction.deleteReply();
        await interaction.followUp(`Submissions for the month of ${months[new Date().getMonth()]} are now open!`);
        return;
    },
};