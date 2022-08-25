const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const util = require('../common/util.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const handler = require('../handlers/createevent.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createevent')
        .setDescription('Create a scheduled server event for the next movie night.')
        .addStringOption(option =>
            option.setName('datetime')
                .setDescription('Set a specific date and time for this event ().')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('Set a specific movie for this event.')
                .setRequired(false)),

    async execute(interaction) {

        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command.' });
            return;
        }
        const input = interaction.options.getString('movie');
        if (input) {
            await interaction.deferReply({ ephemeral: true });
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
                            value: `${suggestion.imdbid},.-*${interaction.options.getString('datetime')}`
                        });
                    }
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId('eventmovie')
                                .setPlaceholder('Select movie...')
                                .addOptions(options));
                    interaction.editReply({ content: 'Which of these movies do you want to set for this event?', components: [row], ephemeral: true });
                    return;

                }).catch(function (error) {
                    interaction.editReply({ content: `No movies found for query "${query}". Please try again. (Internal Error: \`\`${error.message}\`\`)` });
                })
            }
        } else {
            handler.handler(interaction);
        }
    },
};