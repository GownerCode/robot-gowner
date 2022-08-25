const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const movieDB = require('../models/movies.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwatched')
        .setDescription('Add movie to watched list.'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command.' });
            return;
        }

        const movielist = await movieDB.getMoviesForGuild(interaction.guild.id);

        if (movielist.length > 0) {
            let options = []
            movielist.forEach(movie => {
                movie = movie.get();
                console.log(movie)
                options.push({
                    label: movie.title + ` (${movie.year})`,
                    value: `${movie.imdbid}+.-,${movie.title}+.-,${movie.year}`
                });
            });
            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('moviewatched')
                        .setPlaceholder('Nothing selected')
                        .addOptions(options));
            await interaction.editReply({ content: 'Which movie did you watch?', components: [row], ephemeral: true });
        } else {
            await interaction.editReply('There are no movies on the list!');
        }
    },
};