const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const fs = require('fs');

async function handler(interaction) {
    const imdbid = interaction.values[0].split('+.-,')[0];
    const request = await omdb.get({
        id: imdbid
    });
    const title = request.title;
    const year = interaction.values[0].split('+.-,')[1];
    const userid = interaction.values[0].split('+.-,')[2];
    const usertag = interaction.values[0].split('+.-,')[3];

    const movielist = JSON.parse(fs.readFileSync('lists/movies.json'));
    await interaction.update({ content: 'Movie selected.', components: [] });
    if (!(interaction.guild.id in movielist)) {
        movielist[interaction.guild.id] = {
            movies: []
        }
    }
    movielist[interaction.guild.id]["movies"].push({
        title: title,
        imdbid: imdbid,
        user: userid,
        usertag: usertag,
        year: year
    })
    fs.writeFileSync('lists/movies.json', JSON.stringify(movielist));
    interaction.channel.send(`***${title}*** was added to the list by <@${userid}>!`);
}

module.exports = { handler };