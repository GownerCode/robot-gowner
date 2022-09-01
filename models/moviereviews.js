require('../databaseDriver').init();

async function getReviewForMovieAndUser(user, imdbid) {
    return global.db.models.MovieReview.findOne({
        where: {
            user: user,
            movie_id: imdbid
        }
    })
}

async function getAverageReviewScore(imdbid, guild) {
    if (guild) {
        const reviews = await global.db.models.MovieReview.findAll({
            where: {
                movie_id: imdbid,
                guild: guild.id
            }
        })
    } else {
        const reviews = await global.db.models.MovieReview.findAll({
            where: {
                movie_id: imdbid
            }
        })
    }

    if (reviews.length === 0) {
        return false;
    }

    let cum_score = 0;
    for (let i in reviews) {
        cum_score += reviews[i].score;
    }

    return cum_score / reviews.length;
}

async function addReview(review) {
    return global.db.models.MovieReview.create(review);
}

async function deleteReview(user, imdbid) {
    const destroyed = await global.db.models.Movie.destroy({
        where: {
            user: user.id,
            movie_id: imdbid
        }
    });

    if (destroyed === 0) {
        return false;
    }

    return true;
}

async function getAverageReviewScoreForUser(user) {
    const reviews = await global.db.models.MovieReview.findAll({
        where: {
            user: user,
        }
    })

    if (reviews.length === 0) {
        return false;
    }

    let cum_score = 0;
    for (let i in reviews) {
        cum_score += reviews[i].score;
    }

    return cum_score / reviews.length;
}

async function getOverview(imdbid, guild) {
    if (guild) {
        var reviews = await global.db.models.MovieReview.findAll({
            where: {
                movie_id: imdbid,
                guild: guild.id
            }
        });
    } else {
        console.log("HERE")
        var reviews = await global.db.models.MovieReview.findAll({
            where: {
                movie_id: imdbid,
            }
        });
    }

    if (reviews.length === 0) {
        return false;
    }

    let ret = {};

    let cum_score = 0;
    for (let i in reviews) {
        cum_score += reviews[i].get().score;
    }

    ret.averageScore = cum_score / reviews.length;
    ret.totalReviews = reviews.length;
    ret.totalNegative = 0;
    ret.totalPositive = 0;
    for (let i in reviews) {
        if (reviews[i].get().score > 50) {
            ret.totalPositive++;
        } else {
            ret.totalNegative++;
        }
    }

    ret.negativePreview = [];
    ret.positivePreview = [];
    if (reviews.length > 6) {
        let whileCounter = 0;
        while (ret.negativePreview.length < 3) {
            if (whileCounter++ > 50) {
                break;
            }
            const workingReview = reviews[Math.floor(Math.random() * reviews.length)].get();
            if (!ret.negativePreview.includes(workingReview) && workingReview.score <= 50) {
                ret.negativePreview.push(workingReview);
            }
        }

        whileCounter = 0;
        while (ret.positivePreview.length < 3) {
            if (whileCounter++ > 50) {
                break;
            }
            const workingReview = reviews[Math.floor(Math.random() * reviews.length)].get();
            if (!ret.positivePreview.includes(workingReview) && workingReview.score > 50) {
                ret.positivePreview.push(workingReview);
            }
        }
    }

    return ret;
}

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';


const movies = ['tt5013056', 'tt0033467', 'tt0050083', 't14714598', 'tt1700841',
    'tt1059786', 'tt0988045', 'tt7741650', 'tt2024544', 'tt1853728']

const guilds = ['guild1', 'guild2'];

async function populate() {
    for (let i = 0; i < 501; i++) {
        const randID = Math.floor(Math.random() * (999 - 100) + 100).toString();
        const randMovie = movies[Math.floor(Math.random() * 10)];
        const randGuild = guilds[Math.floor(Math.random() * 2)];
        const testReview = await getReviewForMovieAndUser(randID, randMovie);
        console.log(testReview);
        if (testReview != null) {
            continue;
        }

        await addReview({
            user: randID,
            movie_id: randMovie,
            score: Math.floor((Math.random() * 100)),
            text: lorem,
            guild: randGuild
        })
    }
}

async function geto() {
    const o = await getOverview('tt5013056');
    console.log("END:")
    console.log(o);
}

geto()

module.exports = { getOverview, addReview, getAverageReviewScore, getReviewForMovieAndUser, getAverageReviewScoreForUser };