const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js')
const roles = require('../configuration/roles.json')[global.env];

function lowestRated(n, places) {
    let keys = Object.keys(places);
    let ctr = keys.length - 1;
    while (true) {
        let lastn = [];
        for (let i = keys.length - 1; i >= ctr; i--) {
            lastn = lastn.concat(places[i]['movies']);
        }
        if (lastn.length >= n) {
            return lastn;
        }
        ctr--;
    }
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('movievote')
        .setDescription('Start a vote on the movie list (Admins only).')
        .addNumberOption(option =>
            option.setName('duration')
                .setDescription('The vote duration in hours')
                .setRequired(true)),
    async execute(interaction) {
        const vote_duration = interaction.options.getNumber('duration');
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.reply({ content: 'You do not have permission to use this command, you scoundrel.' });
            return;
        }
        const movielist = JSON.parse(fs.readFileSync('./lists/movies.json'))[interaction.guild.id]['movies'];
        let movieString = '';
        for (let i = 0; i < movielist.length; i++) {
            movieString += `${util.reactlist[i]} - ***${movielist[i].title} (${movielist[i].year})***\n\n`
        }
        movieString += '\n';
        const movieVote = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Movie Vote')
            .setAuthor({ name: 'Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' })
            .setDescription(
                `Only 8 out of these ${movielist.length} movies can remain. The movie(s) with the fewest votes will be removed. ` +
                'We will vote every week on which movie to watch next. This poll will be open until ' +
                `**<t:${Math.floor(Date.now() / 1000) + Math.floor(vote_duration * 3600)}:F>** (ends **<t:${Math.floor(Date.now() / 1000) + Math.floor(vote_duration * 3600)}:R>**). In the case of stalemates, ` +
                'I will use my random number subroutine to decide. Feel free to vote for multiple movies.')
            .setThumbnail('http://gownerjones.com/images/avatar.jpg')
            .addFields(
                { name: 'Movies up for voting:\n', value: movieString })
            .setTimestamp()
            .setFooter({ text: 'Beep Boop - A service provided by Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' });

        await interaction.reply({ content: 'Creating poll...', ephemeral: true });
        await interaction.channel.send(`<@&${roles.movie_night_role_id}>`);
        var message = await interaction.channel.send({ embeds: [movieVote] });

        await interaction.editReply('Poll created. Polling = true; submitting = false!');
        const collector = message.createReactionCollector({ time: vote_duration * 60 * 60 * 1000 });

        global.polling = true;
        global.submitting = false;

        collector.on('end', (collected) => {
            let collectedReactions = {};
            for (let react of collected) {
                collectedReactions[react[0]] = react[1].count;
            }

            global.polling = false;
            interaction.channel.send(
                '**__:arrow_up:``This Poll is now closed!``:arrow_up:__**\n' +
                '**:arrow_down:``        Results:       ``:arrow_down:**'
            );
            interaction.channel.send(`<@&${roles.movie_night_role_id}>`);
            let orderedReacts = Object.entries(collectedReactions).sort((a, b) => b[1] - a[1]);
            let places = {};

            let placeCtr = 0;
            while (orderedReacts.length > 0) {

                let element = orderedReacts.shift()
                places[placeCtr] = { movies: [element[0]], votes: element[1] };
                for (let i = 0; i < orderedReacts.length; i++) {
                    if (orderedReacts[i][1] === element[1]) {
                        places[placeCtr]['movies'].push(orderedReacts[i][0]);
                    }
                }
                let removeIndeces = [];
                for (let i = 0; i < orderedReacts.length; i++) {
                    if (orderedReacts[i][1] === element[1]) {
                        removeIndeces.push(i);
                    }
                }
                for (let i = removeIndeces.length - 1; i >= 0; i--) {
                    orderedReacts.splice(removeIndeces[i], 1);
                }
                placeCtr++;

            }

            for (let place in places) {
                let ml = [];
                places[place]['movies'].forEach(react => {
                    ml.push(movielist[util.reactlist.indexOf(react)])
                })
                places[place]['movies'] = ml;
            }

            let embedFieldsResult = [];
            placeCtr = 1;
            let e = ''
            for (let place in places) {
                let placenum = parseInt(place);
                e = (
                    placenum + 1 === 1 ? 'st' :
                        placenum + 1 === 2 ? 'nd' :
                            placenum + 1 === 3 ? 'rd' : 'th'
                )

                let valueString = '';
                places[place]['movies'].forEach(movie => {
                    valueString += `***- ${movie['title']} (${movie['year']})***\n`;
                });

                embedFieldsResult.push(
                    { name: `${(placenum + 1) + e} place: (${places[place]['votes']} vote(s))`, value: valueString }
                )
            }

            embedFieldEliminate = { name: 'Eliminating excess movies:' }
            movieOverflow = movielist.length - global.monthly_movies;
            if (movieOverflow <= 0) {
                embedFieldEliminate.value = 'No movies need to be eliminated. BEEP BOOP <- This is Robospeak for HOORAY!';
            } else {
                lowestRatedMovies = lowestRated(movieOverflow, places);
                if (lowestRatedMovies.length === movieOverflow) {
                    embedFieldEliminate.value =
                        `There ${movieOverflow === 1 ? 'is' : 'are'} exactly ` +
                        `${movieOverflow} ${movieOverflow === 1 ? 'movie' : 'movies'} in last place:\n`
                        ;
                    for (let i = 0; i < lowestRatedMovies.length; i++) {
                        let movie = lowestRatedMovies[i];
                        embedFieldEliminate.value +=
                            `***${movie.title} (${movie.year})***\n`
                        util.removeMovieById(interaction, movie.imdbid);
                    }
                    embedFieldEliminate.value += `\n${movieOverflow === 1 ? 'It' : 'They'} will ${movieOverflow === 1 ? '' : movieOverflow === 2 ? 'both' : 'all'} be eliminated *without prejudice*.`;
                } else {
                    let randoms = [];
                    while (randoms.length < movieOverflow) {
                        let r = util.randInt(0, lowestRatedMovies.length);
                        if (!randoms.includes(r)) {
                            randoms.push(r)
                        }
                    }
                    embedFieldEliminate.value = `These are the ${lowestRatedMovies.length} lowest rated movies:\n`;

                    for (let i = 0; i < lowestRatedMovies.length; i++) {
                        let movie = lowestRatedMovies[i];
                        embedFieldEliminate.value += `  ${i + 1}. ***${movie.title} (${movie.year})***\n`
                    }

                    embedFieldEliminate.value +=
                        `\n**${movieOverflow}** of them must be eliminated *without prejudice*.\n` +
                        `Initiating random number subroutine...\nBe**33**p... Bo**0**o**00**p...\n\n` +
                        `The movies randomly chosen for expulsion are:\n`;

                    for (let i = 0; i < randoms.length; i++) {
                        embedFieldEliminate.value += `***${lowestRatedMovies[randoms[i]].title} (${lowestRatedMovies[randoms[i]].year})***\n`
                        util.removeMovieById(interaction, lowestRatedMovies[randoms[i]].imdbid)
                    }
                    embedFieldEliminate.value += `They will be promptly removed.`
                }
            }

            const movieVoteResults = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Movie Vote - Results')
                .setAuthor({ name: 'Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' })
                .setDescription(
                    `These are the results of our vote:`
                )
                .setThumbnail('http://gownerjones.com/images/avatar.jpg')
                .addFields(
                    embedFieldsResult
                )
                .addFields(embedFieldEliminate)
                .setTimestamp()
                .setFooter({ text: 'Beep Boop - A service provided by Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' });

            interaction.channel.send({ embeds: [movieVoteResults] })
        })
        for (let i = 0; i < movielist.length; i++) {
            await message.react(util.reactlist[i]);
        }
        return;
    },
};