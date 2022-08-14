const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemovie')
        .setDescription('Remove your movie from the list.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose movie you are removing (Admins only).')
                .setRequired(false)),
    async execute(interaction) {
        if (interaction.options.getUser('user') !== null) {
            if (!util.userHasAdminRights(interaction.member)) {
                if (interaction.options.getUser('user').id !== interaction.user.id) {
                    await interaction.reply({ content: `<@${interaction.user.id}> - Only admins can remove another user's movie! Beep Boop!` });
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

        const removed = util.removeMovieByUser(interaction, user.id);
        if (removed) {
            await interaction.reply(`<@${user.id}>, your movie, ***${removed.title} (${removed.year})***  has been removed from the list!`);
            return;
        } else {
            await interaction.reply(`You have not added a movie to the list this month, <@${user.id}>.`);
            return;
        }
    },
};