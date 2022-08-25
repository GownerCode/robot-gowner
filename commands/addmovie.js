const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const util = require('../common/util.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const movieDB = require('../models/movies.js');
const statesDB = require('../models/states.js');

const MOVIE_VOTE_CHANNEL_ID = '1005016756206698526';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmovie')
        .setDescription('Add a movie to the list.')
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('The movie you want to add')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user in whose name you are adding a movie (Admins only).')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const submitting = await statesDB.getState('submitting');
        const polling = await statesDB.getState('polling');

        if (!(submitting.get()['data'] === 'true') && !(polling.get()['data'] === 'true')) {
            await interaction.editReply({ content: `:robot: <@${interaction.user.id}> - Beep Boop! Submissions are currently closed. They will re-open next month!` });
            return;
        }
        else if (!(submitting.get()['data'] === 'true') && polling.get()['data'] === 'true') {
            await interaction.editReply({ content: `:robot: <@${interaction.user.id}> - Beep Boop! Submissions are closed. Please head to ${interaction.guild.channels.cache.get(MOVIE_VOTE_CHANNEL_ID).toString()} to cast your vote!` });
            return;
        }
        if (interaction.options.getUser('user') !== null) {
            if (!util.userHasAdminRights(interaction.member)) {
                if (interaction.options.getUser('user').id !== interaction.user.id) {
                    await interaction.editReply({ content: `<@${interaction.user.id}> - Only admins can add a movie in the name of another user. Beep Beep Boop!` });
                    return;
                } else {
                    var user = interaction.options.getUser('user');
                }
            } else {
                var user = interaction.options.getUser('user');
            }
        } else {
            var user = interaction.user;
        }

        const added = await movieDB.userHasMovie(user, interaction.guild);
        if (added) {
            await interaction.editReply(`<@${user.id}> - You have already added a movie this month:\n` +
                `***${added.title} (${added.year})***\n` +
                'If you changed your mind, please remove your movie with ' +
                '/remove before adding a new movie.');
            return;
        }

        const input = interaction.options.getString('movie');
        const imdblinkpattern = /^(https?:\/\/)?(www\.)?imdb\.com.*/;

        if (input.match(imdblinkpattern)) {

            const query = util.parseIMDBLink(input);

            if (!query) {
                await interaction.editReply({ content: `No movie found for your link. Please double check you're adding a movie and not a TV show or other media.` });
                return;
            }

            try {
                const result = await omdb.get({
                    id: query,
                    type: 'movie'
                })
                await movieDB.addMovie(result, user, interaction.guild);
                interaction.editReply(`***${result.title} (${result.year})*** was added to the list by <@${user.id}>!`);
                return;
            } catch (error) {
                console.log(error);
                await interaction.editReply({ content: `No movies found for your link. Please double check you're adding a movie and not a TV show or other media.` });
                return;
            }

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
                            .setCustomId('movieadd')
                            .setPlaceholder('Nothing selected')
                            .addOptions(options));
                interaction.editReply({ content: 'Which of these movies did you mean?', components: [row], ephemeral: true });
                return;

            }).catch(function (error) {
                interaction.editReply({ content: `No movies found for query "${query}". Please try again.` });
            })
        }
    },
};