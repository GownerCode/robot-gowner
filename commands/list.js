const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movielist')
        .setDescription('Shows the current movie list for this month.'),
    async execute(interaction) {
        let movielist = JSON.parse(fs.readFileSync('./lists/movies.json'));
        if (interaction.guild.id in movielist && movielist[interaction.guild.id]['movies'].length > 0) {
            movielist = movielist[interaction.guild.id]['movies'];
            let liststring = '';
            for (let x = 0; x < movielist.length; x++) {
                liststring += `${x + 1}. ***${movielist[x].title} (${movielist[x].year})*** submitted by ${movielist[x].usertag}\n`;
            }
            liststring += `\n In total, **${movielist.length}** ${movielist.length > 1 ? 'movies' : 'movie'} ${movielist.length > 1 ? 'have' : 'has'} been submitted in ${util.months[new Date().getMonth()]}.`
            await interaction.editReply(liststring);
        } else {
            await interaction.editReply(`No movies have been submitted in ${util.months[new Date().getMonth()]} yet.`)
        }
    },
};