const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const viewedDB = require('../models/viewed.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watched')
        .setDescription('Shows all movies that have been watched so far.'),
    async execute(interaction) {
        await interaction.deferReply();

        const viewedlist = await viewedDB.getWatched(interaction.guild);

        if (viewedlist.length === 0) {
            await interaction.editReply({ content: `No movies have been watched yet.` });
            return;
        }

        let liststring = '';
        for (let x = 0; x < viewedlist.length; x++) {
            const movie = viewedlist[x].get();
            liststring += `${x + 1}. ***${movie.title} (${movie.year})*** watched on <t:${movie.viewedDate.getTime() / 1000}:D>\n`;
        }

        await interaction.editReply({ content: `These movies have been watched so far on this server:\n${liststring}\nTotal movies watched: ${viewedlist.length}` });
        return;
    },
};