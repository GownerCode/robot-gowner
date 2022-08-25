const fs = require('fs');
const viewedDB = require('../models/viewed.js');
const statesDB = require('../models/states.js');

async function handler(interaction) {
    await interaction.deferReply();

    const title = interaction.values[0].split('+.-,')[1];
    const imdbid = interaction.values[0].split('+.-,')[0];
    const year = interaction.values[0].split('+.-,')[2];

    await interaction.deleteReply();

    const watched = await viewedDB.setWatched({
        title: title,
        imdbid: imdbid,
        year: year
    }, interaction.guild);

    if (!watched) {
        await interaction.channel.send(`***${title}*** is already on the watched list!`);
        return;
    } else {
        statesDB.changeState('nextmovie', 'null');
        await interaction.channel.send(`***${title}*** has been added to the watched movies list!`);
        return;
    }
}

module.exports = { handler };