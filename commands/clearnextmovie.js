const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const roles = require('../configuration/roles.json')[global.env];
const channels = require('../configuration/channels.json')[global.env];
const statesDB = require('../models/states.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearnextmovie')
        .setDescription('Clear the next movie state. (Admins only)'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command, you naughty person.' });
            return;
        }

        statesDB.changeState('nextmovie', 'null');
        interaction.editReply('The next movie state has been cleared.')
    },
};