const movieAddHandler = require('./movieadd.js');
const movieWatchedHandler = require('./moviewatched.js');
const movieInfoHandler = require('./movieinfo.js');
const createEventHandler = require('./createevent.js');
const bookInfoHandler = require('./bookinfo.js');

async function selecthandler(interaction) {
    if (interaction.customId === 'movieadd') {
        movieAddHandler.handler(interaction);
    }

    else if (interaction.customId === 'moviewatched') {
        movieWatchedHandler.handler(interaction);
    }

    else if (interaction.customId === 'movieinfo') {
        movieInfoHandler.handler(interaction);
    }
    else if (interaction.customId === 'eventmovie') {
        createEventHandler.handler(interaction);
    }
    else if (interaction.customId === 'bookinfo') {
        bookInfoHandler.handler(interaction);
    }
}

module.exports = { selecthandler };