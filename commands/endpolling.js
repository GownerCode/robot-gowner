const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endpolling')
        .setDescription('Close submissions (Admins only)'),
    async execute(interaction) {
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.reply({ content: 'You do not have permission to use this command.' });
            return;
        }
        global.polling = false;
        await interaction.reply(`Polling state ended.`);
        return;
    },
};