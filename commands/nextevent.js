const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const roles = require('../configuration/roles.json')[global.env];
const channels = require('../configuration/channels.json')[global.env];
const statesDB = require('../models/states.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextevent')
        .setDescription('Find out when the next movie night is.')
        .addBooleanOption(option =>
            option.setName('mention')
                .setDescription('An option for admins to mention people. Just leave this blank ;)')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.member.roles.cache.has('993328798227513384') && !interaction.member.roles.cache.has('1003394475621630032')) {
            var mention = false;
        } else {
            var mention = interaction.options.getBoolean('mention');
        }

        const next = util.getNextEventTimestamp();
        var nextMovie = await statesDB.getState('nextmovie');
        nextMovie = JSON.parse(nextMovie.get()['data']);
        let replyString = ``
        replyString +=
            `The next ${mention ? `<@&${roles.movie_night_role_id}>` : 'Movie Night'} will be on\n**<t:${next}:f> (<t:${next}:R>)**\n`;
        if (nextMovie != null) {
            replyString +=
                `We will be watching\n***${nextMovie.title} (${nextMovie.year})***\n`
        } else {
            replyString +=
                `The next movie has not been determined yet. Keep an eye out for messages in <#${channels.movie_info_channel}>!\n`
        }
        replyString +=
            `⁽ᵃˡˡ ᵗⁱᵐᵉˢ ᵃʳᵉ ⁱⁿ ʸᵒᵘʳ ˡᵒᶜᵃˡ ᵗⁱᵐᵉᶻᵒⁿᵉ⁾ ⁽ᵗʰᵉ ᵗⁱᵐᵉ ⁱⁿ ᵖᵃʳᵉⁿᵗʰᵉˢᵉˢ ʷⁱˡˡ ᶜᵒᵘⁿᵗ ᵈᵒʷⁿ ᵗᵒ ᵗʰᵉ ᵉᵛᵉⁿᵗ⁾`
        interaction.editReply(replyString)
    },
};