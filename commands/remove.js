const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const movieDB = require('../models/movies.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemovie')
        .setDescription('Remove your movie from the list.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose movie you are removing (Admins only).')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply();
        if (interaction.options.getUser('user') !== null) {
            if (!util.userHasAdminRights(interaction.member)) {
                if (interaction.options.getUser('user').id !== interaction.user.id) {
                    await interaction.editReply({ content: `<@${interaction.user.id}> - Only admins can remove another user's movie! Beep Boop!` });
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

        const removed = await movieDB.removeMovie(user, interaction.guild);
        if (removed) {
            await interaction.editReply(`<@${user.id}>, your movie, ***${removed.title} (${removed.year})***  has been removed from the list!`);
            return;
        } else {
            await interaction.editReply(`You have not added a movie to the list this month, <@${user.id}>.`);
            return;
        }
    },
};