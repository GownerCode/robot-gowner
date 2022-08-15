const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const roles = require('../configuration/roles.json')[global.env];
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextvote')
        .setDescription('Start a vote on the next movie to watch (Admins only).')
        .addNumberOption(option =>
            option.setName('duration')
                .setDescription('The vote duration in hours')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const vote_duration = interaction.options.getNumber('duration');
        if (!util.userHasAdminRights(interaction.member)) {
            await interaction.editReply({ content: 'You do not have permission to use this command, **you scoundrel**.' });
            return;
        }
        var movielist = JSON.parse(fs.readFileSync('lists/movies.json'));
        if (!movielist[interaction.guild.id]['movies']) {
            interaction.editReply(`The list is empty. Cannot create poll.`);
            return
        } else {
            movielist = movielist[interaction.guild.id]['movies'];
        }
        let movieString = '';
        for (let i = 0; i < movielist.length; i++) {
            movieString += `${util.reactlist[i]} - ***${movielist[i].title} (${movielist[i].year})***\n\n`
        }
        movieString += '\n';
        const movieVote = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Next Movie Vote')
            .setAuthor({ name: 'Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' })
            .setDescription(
                `This vote will determine which movie will be watched during the next Movie Night. ` +
                `The movie with the highest number of votes will win. Any stalemates will be resolved by my random number subroutine.\n` +
                `This poll will be open until **<t:${Math.floor(Date.now() / 1000) + Math.floor(vote_duration * 3600)}:F>** ` +
                `(ends **<t:${Math.floor(Date.now() / 1000) + Math.floor(vote_duration * 3600)}:R>**)`)
            .setThumbnail('http://gownerjones.com/images/avatar.jpg')
            .addFields(
                { name: 'Movies up for voting:\n', value: movieString })
            .setTimestamp()
            .setFooter({ text: 'Beep Boop - A service provided by Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' });

        await interaction.editReply({ content: 'Creating poll...', ephemeral: true });
        await interaction.channel.send(`<@&${roles.movie_night_role_id}>`);
        var message = await interaction.channel.send({ embeds: [movieVote] });

        await interaction.editReply('Poll created.');
        const collector = message.createReactionCollector({ time: vote_duration * 60 * 60 * 1000 });

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
            /*
            {
                0: {
                    movies: [:one:, :five:, :eight:],
                    votes: 10
                }
            }
            */
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

            embedFieldEliminate = { name: 'Determining next movie:' }

            if (places[0]['movies'].length === 1) {
                embedFieldEliminate.value = `The winner is:\n***${places[0]['movies'][0].title} (${places[0]['movies'][0].year})***!\n`
                global.nextmovie = places[0]['movies'][0];
            } else {
                embedFieldEliminate.value = `The top spot is shared by:\n`;

                for (let i = 0; i < places[0]['movies'].length; i++) {
                    const movie = places[0]['movies'][i];
                    embedFieldEliminate.value += `${i + 1}. ***${movie['title']} (${movie['year']})***\n`;
                }

                embedFieldEliminate.value += `\nOnly one can be the winner! Initiating random ` +
                    `number subroutine...\nBe**33**p... Bo**0**o**00**p...\n\n` +
                    `The movie randomly chosen for the next Movie Night is:\n`;
                const chosenmovie = places[0]['movies'][util.randInt(0, places[0]['movies'].length)];
                embedFieldEliminate.value += `***${chosenmovie.title} (${chosenmovie.year})***!\n`
                global.nextmovie = chosenmovie;
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