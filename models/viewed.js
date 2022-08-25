async function setWatched(movie, guild) {

    const res = await global.db.models.Viewed.findAll({
        where: {
            imdbid: movie.imdbid
        }
    })

    console.log(res);

    if (res.length > 0) {
        return false;
    }

    const writeObject = {
        title: movie.title,
        imdbid: movie.imdbid,
        year: movie.year,
        guild: guild.id,
        viewedDate: new Date()
    }

    return global.db.models.Viewed.create(writeObject);
}

async function getWatched(guild) {
    console.log(guild.id)
    return global.db.models.Viewed.findAll({
        where: {
            guild: guild.id
        }
    })
}

module.exports = { getWatched, setWatched };