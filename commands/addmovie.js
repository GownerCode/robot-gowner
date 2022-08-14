const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const util = require('../common/util.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);

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
        if (!global.submitting && !global.polling) {
            await interaction.reply({ content: `:robot: <@${interaction.user.id}> - Beep Boop! Submissions are currently closed. They will re-open next month!` });
            return;
        }
        else if (!global.submitting && global.polling) {
            await interaction.reply({ content: `:robot: <@${interaction.user.id}> - Beep Boop! Submissions are closed. Please head to ${interaction.guild.channels.cache.get(MOVIE_VOTE_CHANNEL_ID).toString()} to cast your vote!` });
            return;
        }
        if (interaction.options.getUser('user') !== null) {
            if (!util.userHasAdminRights(interaction.member)) {
                if (interaction.options.getUser('user').id !== interaction.user.id) {
                    await interaction.reply({ content: `<@${interaction.user.id}> - Only admins can add a movie in the name of another user. Beep Beep Boop!` });
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

        const added = util.userHasMovie(interaction, user)
        if (added) {
            await interaction.reply(`<@${user.id}> - You have already added a movie this month:\n` +
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
                await interaction.reply({ content: `No movie found for your link. Please double check you're adding a movie and not a TV show or other media.` });
                return;
            }

            omdb.get({
                id: query,
                type: 'movie'
            }).then((result) => {
                const movielist = JSON.parse(fs.readFileSync('./lists/movies.json'));
                if (!(interaction.guild.id in movielist)) {
                    movielist[interaction.guild.id] = {
                        movies: []
                    }
                }
                movielist[interaction.guild.id]["movies"].push({
                    title: result.title,
                    imdbid: result.imdbid,
                    user: user.id,
                    usertag: user.tag,
                    year: result.year
                })
                fs.writeFileSync('lists/movies.json', JSON.stringify(movielist));
                interaction.reply(`***${result.title} (${result.year})*** was added to the list by <@${user.id}>!`);
                return;

            }).catch(function (error) {
                console.log(error);
                interaction.reply({ content: `No movies found for your link. Please double check you're adding a movie and not a TV show or other media.` });
            })
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
                interaction.reply({ content: 'Which of these movies did you mean?', components: [row], ephemeral: true });
                return;

            }).catch(function (error) {
                interaction.reply({ content: `No movies found for query "${query}". Please try again.` });
            })
        }
    },
};