const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
const util = require('../common/util.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('inflation')
        .setDescription('Find out how much buying power an amount of money from back in the day has now.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money in USD')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year in which the money was made (YYYY)')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const amount = interaction.options.getInteger('amount');
        const year = interaction.options.getInteger('year');

        if (year < 1913 || year > new Date().getFullYear()) {
            await interaction.editReply(`The year must be between 1913 and ${new Date().getFullYear()}.`);
            return;
        }

        const newamount = await util.getAdjustedPrice(amount, year);

        const amountFirstPart = parseFloat(amount.toFixed(2)).toLocaleString().split('.')[0];
        let amountSecondPart = parseFloat(amount.toFixed(2)).toLocaleString().split('.')[1];
        if (amountSecondPart) {
            amountSecondPart = amountSecondPart.padEnd(2, 0);
        } else {
            amountSecondPart = '';
        }

        const amountFormatted = `${amountFirstPart}${amountSecondPart != '' ? '.' + amountSecondPart : ''}`

        const newamountFirstPart = parseFloat(newamount.toFixed(2)).toLocaleString().split('.')[0];
        let newamountSecondPart = parseFloat(newamount.toFixed(2)).toLocaleString().split('.')[1];
        if (newamountSecondPart) {
            newamountSecondPart = newamountSecondPart.padEnd(2, 0);
        } else {
            newamountSecondPart = '';
        }

        const newamountFormatted = `${newamountFirstPart}${newamountSecondPart != '' ? '.' + newamountSecondPart : ''}`

        await interaction.editReply(`$${amountFormatted} in ${year} has the buying power of $${newamountFormatted} today.`);
        return;
    },
};