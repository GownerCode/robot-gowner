const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rghelp')
        .setDescription('Robot-Gowner help.'),
    async execute(interaction) {
        await interaction.reply(
            `Beep Boop! Greetings, human <@${interaction.user.id}>! I am **Robot-Gowner**, your friendly assistant!\n\n` +
            '**Movie commands:**\n' +
            'Use `/addmovie` to add a movie to the list. You can only add one per month, so make it count!\n' +
            'Use `/removemovie` to remove your movie, if you want to change your mind.\n' +
            'Use `/movielist` to see the current list for this month.\n' +
            'Use `/watched` to see a list of all movies that have been watched on this server since I\'ve been here!\n' +
            'Use `/nextevent` to get information on the upcoming Movie Night. That includes the date, time, a countdown and, if determined, the movie we will be watching.\n' +
            '\n**Book commands:**\n' +
            'Use `/bookinfo` to get various information about a book.\n' +
            '\n**Miscellaneous commands:**\n' +
            'Use `/inflation` to use my built-in inflation calculator.\n' +
            'Use `/halfepoch` to find your Half-Epoch moment! ([What is that?](https://www.gownerjones.com/half-epoch))\n' +
            '\n**Notes:**\nI am still in active development. If I don\'t respond, just try again a few seconds later.\n' +
            'If you find any bugs or issues, contact Gowner Jones for technical support.\n' +
            '\nBeep Boop, **Robot-Gowner** wishes you a fun biological time, human!' +
            `\n\n P.S: I can even tell the time: <t:${Math.floor(Date.now() / 1000)}:T>`);
    },
};