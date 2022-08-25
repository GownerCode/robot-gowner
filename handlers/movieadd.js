const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const fs = require('fs');
const movieDB = require('../models/movies.js');

async function handler(interaction) {
    const imdbid = interaction.values[0].split('+.-,')[0];
    const request = await omdb.get({
        id: imdbid
    });
    const title = request.title;
    const year = interaction.values[0].split('+.-,')[1];
    const userid = interaction.values[0].split('+.-,')[2];
    const usertag = interaction.values[0].split('+.-,')[3];

    const user = {
        id: userid,
        tag: usertag
    }

    const movie = {
        title: title,
        year: year,
        imdbid: imdbid,
    }

    await movieDB.addMovie(movie, user, interaction.guild);
    interaction.reply(`***${title}*** was added to the list by <@${userid}>!`);
}

module.exports = { handler };