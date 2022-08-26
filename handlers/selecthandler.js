const movieAddHandler = require('./movieadd.js');
const movieWatchedHandler = require('./moviewatched.js');
const movieInfoHandler = require('./movieinfo.js');
const createEventHandler = require('./createevent.js');
const bookInfoHandler = require('./bookinfo.js');
const setNextMovieHandler = require('./setnextmovie.js');

async function selecthandler(interaction) {
    if (interaction.customId === 'movieadd') {
        await movieAddHandler.handler(interaction);
    }

    else if (interaction.customId === 'moviewatched') {
        await movieWatchedHandler.handler(interaction);
    }

    else if (interaction.customId === 'movieinfo') {
        await movieInfoHandler.handler(interaction);
    }

    else if (interaction.customId === 'eventmovie') {
        await createEventHandler.handler(interaction);
    }

    else if (interaction.customId === 'bookinfo') {
        await bookInfoHandler.handler(interaction);
    }

    else if (interaction.customId === 'setnextmovie') {
        await setNextMovieHandler.handler(interaction);
    }
}

module.exports = { selecthandler };