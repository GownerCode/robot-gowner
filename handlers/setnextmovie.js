const { EmbedBuilder } = require('discord.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const statesDB = require('../models/states.js')

async function handler(interaction) {
    const imdbid = interaction.values[0].split('+.-,')[0];
    const request = await omdb.get({
        id: imdbid
    });
    const title = request.title;
    const year = interaction.values[0].split('+.-,')[1];
    const userid = interaction.values[0].split('+.-,')[2];
    const usertag = interaction.values[0].split('+.-,')[3];

    const movie = {
        title: title,
        year: year,
        imdbid: imdbid,
        user: userid,
        usertag: usertag
    }

    statesDB.changeState('nextmovie', movie);
    interaction.reply({ content: 'Next movie has been set.', ephemeral: true });
    return;
}

module.exports = { handler };