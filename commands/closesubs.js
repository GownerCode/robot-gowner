const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const statesDB = require('../models/states.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closesubs')
        .setDescription('Close submissions (Admins only)'),
    async execute(interaction) {
        await interaction.deferReply();
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command.' });
            return;
        }
        await statesDB.changeState('submitting', false);
        await interaction.editReply(`Submissions for the month of ${util.months[new Date().getMonth()]} are now closed!`);
        return;
    },
};