const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const handler = require('../handlers/movieinfo.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movieinfo')
        .setDescription('Get information on a movie from IMDB.')
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('The movie you want to see info on. (Title or IMDB Link)')
                .setRequired(true)),
    async execute(interaction) {

        const user = interaction.user;
        const input = interaction.options.getString('movie');
        const imdblinkpattern = /^(https?:\/\/)?(www\.)?imdb\.com.*/;

        if (input.match(imdblinkpattern)) {

            const query = util.parseIMDBLink(input);

            if (!query) {
                await interaction.editReply({ content: `Invalid IMDb link. Please double check you're adding a movie and not a TV show or other media.` });
                return;
            }

            try {
                var result = await omdb.get({
                    id: query,
                    type: 'movie'
                });
            } catch (error) {
                console.log('Error: ' + error);
                var IMDBError = error;
                var result = false;
            }

            if (!result) {
                await interaction.editReply({ content: `An error ocurred while retrieving your movie: \`\`${IMDBError.message}\`\`` });
                return;
            }

            handler.handler(interaction, result);

        } else {

            var query = interaction.options.getString('movie');
            omdb.search({
                search: query,
                type: 'movie'
            }).then((result) => {
                options = [];
                for (const [key, suggestion] of Object.entries(result)) {
                    options.push({
                        label: suggestion.title + ` (${suggestion.year})`,
                        value: `${suggestion.imdbid}+.-,${suggestion.year}+.-,${user.id}+.-,${user.tag}`
                    });
                }
                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('movieinfo')
                            .setPlaceholder('Select movie...')
                            .addOptions(options));
                interaction.editReply({ content: 'Which of these movies do you want to know more about?', components: [row], ephemeral: true });
                return;

            }).catch(function (error) {
                interaction.editReply({ content: `No movies found for query "${query}". Please try again. (Internal Error: \`\`${error.message}\`\`)` });
            })
        }
    },
};