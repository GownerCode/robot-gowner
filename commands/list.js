const { SlashCommandBuilder } = require('discord.js');
const movieDB = require('../models/movies.js');
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movielist')
        .setDescription('Shows the current movie list for this month.'),
    async execute(interaction) {
        await interaction.deferReply();
        let movielist = await movieDB.getMoviesForGuild(interaction.guild.id);
        if (movielist.length > 0) {
            let liststring = '';
            for (let x = 0; x < movielist.length; x++) {
                liststring += `${x + 1}. ***${movielist[x].get().title} (${movielist[x].get().year})*** submitted by ${movielist[x].get().usertag}\n`;
            }
            liststring += `\n In total, **${movielist.length}** ${movielist.length > 1 ? 'movies' : 'movie'} ${movielist.length > 1 ? 'have' : 'has'} been submitted in ${util.months[new Date().getMonth()]}.`
            await interaction.editReply(liststring);
        } else {
            await interaction.editReply(`No movies have been submitted in ${util.months[new Date().getMonth()]} yet.`)
        }
    },
};