/**
 * A collection of utility functions.
 */

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];

const reactlist = [
    '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣',
    '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨',
    '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰',
]

function removeMovieById(interaction, imdbid) {
    const fs = require('fs');
    let movielist = JSON.parse(fs.readFileSync('lists/movies.json'));
    working_movielist = movielist[interaction.guild.id]['movies'];
    for (let x = 0; x < working_movielist.length; x++) {
        if (working_movielist[x].imdbid === imdbid) {
            working_movielist.splice(x, 1);
            fs.writeFileSync('lists/movies.json', JSON.stringify(movielist));
            return;
        }
    }
}

function removeMovieByUser(interaction, userid) {
    const fs = require('fs');
    let movielist = JSON.parse(fs.readFileSync('lists/movies.json'));
    if (movielist[interaction.guild.id]) {
        working_movielist = movielist[interaction.guild.id]['movies'];
        for (let x = 0; x < working_movielist.length; x++) {
            if (working_movielist[x].user === userid) {
                const removed = working_movielist.splice(x, 1);
                fs.writeFileSync('lists/movies.json', JSON.stringify(movielist));
                return removed[0];
            }
        }
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function userHasAdminRights(member) {
    const roles = require('../configuration/roles.json');
    for (let i = 0; i < roles[member.guild.id].movie_admin_role_ids.length; i++) {
        const id = roles[member.guild.id].movie_admin_role_ids[i];
        if (member.roles.cache.has(id)) {
            return true;
        }
    }
    return false;
}

async function getAdjustedPrice(previousPrice, previousYear) {
    const bls2 = require('bls2');
    const series = 'CUUR0000SA0'
    const { blsApi } = require('../configuration/access_config.json')['dev']
    const API = blsApi;

    let bls = new bls2(API);

    let options = {
        'seriesid': [series],
        'startyear': previousYear,
        'endyear': previousYear,
    };

    let result = await bls.fetch(options);

    let oldCPI = 0;
    for (let i = 0; i < result.Results.series[0].data.length; i++) {
        const month = result.Results.series[0].data[i];
        oldCPI += parseFloat(month.value)
    }
    oldCPI = oldCPI / result.Results.series[0].data.length

    options = {
        'seriesid': [series],
        'startyear': new Date().getFullYear(),
        'endyear': new Date().getFullYear(),
    };
    result = await bls.fetch(options);

    let newCPI = 0;
    for (let i = 0; i < result.Results.series[0].data.length; i++) {
        const month = result.Results.series[0].data[i];
        newCPI += parseFloat(month.value)
    }
    newCPI = newCPI / result.Results.series[0].data.length;

    return previousPrice * (newCPI / oldCPI);
}

function userHasMovie(interaction, user) {
    const fs = require('fs');
    let movielist = JSON.parse(fs.readFileSync('lists/movies.json'));
    if (interaction.guild.id in movielist) {
        movielist = movielist[interaction.guild.id]['movies'];
        for (let x = 0; x < movielist.length; x++) {
            if (movielist[x].user === user.id) {
                return movielist[x];
            }
        }
    }
    return false;
}

function parseIMDBLink(link) {
    const imdbidpattern = /^tt.*/;
    let query = '';

    link.split('/').forEach(part => {
        if (part.match(imdbidpattern)) {
            query = part;
            return;
        }
    });

    if (query !== '') {
        return query;
    }
}

function addMovie(movie) {
    const movielist = JSON.parse(fs.readFileSync('lists/movies.json'));
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
}

function startupInfo(client) {
    console.log('Client started. The following commands are registered and ready:');
    for (let command of client.commands) {
        console.log(`/${command[1].data.name}: ${command[1].data.description}`)
    }
    console.log(`Environment: ${global.env}`);
}

function nextDay(x) {
    var now = new Date();
    now.setDate(now.getDate() + (x + (7 - now.getDay())) % 7);
    return now;
}

function getNextEventTimestamp() {
    if (new Date().getDay() === 6) {
        var next = new Date();
        next.setHours(22, 0, 0, 0);
    } else {
        var next = nextDay(5);
        next.setHours(22, 0, 0, 0);
    }
    return Math.floor(next.getTime() / 1000);
}

module.exports = {
    getAdjustedPrice, getNextEventTimestamp, addMovie, reactlist, months, nextDay, startupInfo, removeMovieById, removeMovieByUser, randInt, userHasAdminRights, userHasMovie, parseIMDBLink
}