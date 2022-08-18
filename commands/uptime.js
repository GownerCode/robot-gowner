const { SlashCommandBuilder } = require('discord.js');
const timeDelta = require('time-delta').create({ span: 10 });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Find out how long the bot has been running.'),
    async execute(interaction) {
        await interaction.deferReply();
        const timeString = timeDelta.format(global.startUpTime, new Date())
        await interaction.editReply(`Robot-Gowner has been running for\n**${timeString}**.`);
        return;
    },
};