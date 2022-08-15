const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwatched')
        .setDescription('Add movie to watched list.'),
    async execute(interaction) {
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command.' });
            return;
        }
        const movielist = JSON.parse(fs.readFileSync('./lists/movies.json'));
        if (interaction.guild.id in movielist && movielist[interaction.guild.id]['movies'].length > 0) {
            let options = []
            movielist[interaction.guild.id]['movies'].forEach(movie => {
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