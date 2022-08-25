async function getMoviesForGuild(guildId) {
    return global.db.models.Movie.findAll({
        where: {
            guild: guildId
        }
    })
}

async function userHasMovie(user, guild) {
    const res = await global.db.models.Movie.findAll({
        where: {
            user: user.id,
            guild: guild.id
        }
    })

    if (res.length > 0) {
        return res[0].get();
    } else {
        return false;
    }
}

async function addMovie(movie, user, guild) {
    return global.db.models.Movie.create({
        title: movie.title,
        imdbid: movie.imdbid,
        user: user.id,
        usertag: user.tag,
        year: movie.year,
        guild: guild.id
    })
}

async function removeMovie(user, guild) {

    const movie = await userHasMovie(user, guild);
    if (movie) {
        global.db.models.Movie.destroy({
            where: {
                user: user.id,
                guild: guild.id
            }
        });
        return movie;
    } else {
        return false;
    }
}

async function clearList(guild) {
    global.db.models.Movie.destroy({
        where: {
            guild: guild.id
        }
    });
}

module.exports = { getMoviesForGuild, userHasMovie, addMovie, removeMovie, clearList };