const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const util = require('../common/util.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);

const MOVIE_VOTE_CHANNEL_ID = '1005016756206698526';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnextmovie')
        .setDescription('Set the next movie state. (Admins only)')
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('The movie you want to set as next')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command, you naughty person.' });
            return;
        }

        const input = interaction.options.getString('movie');


        var query = interaction.options.getString('movie');
        omdb.search({
            search: query,
            type: 'movie'
        }).then((result) => {
            options = [];
            for (const [key, suggestion] of Object.entries(result)) {
                options.push({
                    label: suggestion.title + ` (${suggestion.year})`,
                    value: `${suggestion.imdbid}+.-,${suggestion.year}+.-,${interaction.user.id}+.-,${interaction.user.tag}`
                });
            }
            console.log("OPTIONS");
            console.log(options)
            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('setnextmovie')
                        .setPlaceholder('Nothing selected')
                        .addOptions(options));
            interaction.editReply({ content: 'Which of these movies did you mean?', components: [row], ephemeral: true });
            return;

        }).catch(function (error) {
            console.log(error);
            interaction.editReply({ content: `No movies found for query "${query}". Please try again.` });
            return;
        })

    },
};