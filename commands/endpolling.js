const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const statesDB = require('../models/states.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endpolling')
        .setDescription('Close submissions (Admins only)'),
    async execute(interaction) {
        await interaction.deferReply();
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command.' });
            return;
        }
        await statesDB.changeState('polling', false);
        await interaction.editReply(`Polling state ended.`);
        return;
    },
};