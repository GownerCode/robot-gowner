const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const handler = require('../handlers/movieinfo.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('halfepoch')
        .setDescription('Find your Half-Epoch date.')
        .addStringOption(option =>
            option.setName('birthday')
                .setDescription('Enter your birthday in this format: MM-DD-YYYY')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription('If this is true, your half-epoch won\'t be shown in chat.')
                .setRequired(true)),
    async execute(interaction) {
        const bdaystring = interaction.options.getString('birthday');
        const private = interaction.options.getBoolean('private');

        const bdayregex = /^\d{2}-\d{2}-\d{4}$/;
        if (!bdaystring.match(bdayregex)) {
            await interaction.editReply('Invalid date format for your birthday. Please format it like this: MM-DD-YYYY');
            return;
        }
        const bday = new Date(parseInt(bdaystring.split('-')[2]), parseInt(bdaystring.split('-')[0]) - 1, parseInt(bdaystring.split('-')[1]))
        const bd = Math.floor(bday.getTime() / 1000);
        const c2 = 2208988800;
        const c1 = bd + c2;
        const halfepoch = 2 * c1 - 2 * c2;

        await interaction.editReply({ content: `<@${interaction.user.id}>, your Half-Epoch is on <t:${halfepoch}:D>`, ephemeral: private })
        return;
    }
};