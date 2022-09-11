const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const util = require('../common/util.js');
const channels = require('../configuration/channels.json')[global.env];
const statesDB = require('../models/states.js');

async function handler(interaction) {
    if (interaction.isSelectMenu()) {
        await interaction.deferReply();
        const imdbid = interaction.values[0].split(',.-*')[0];
        var movie = await omdb.get({
            id: imdbid
        });

        var input = interaction.values[0].split(',.-*')[1];
    } else {
        await interaction.deferReply();
        var input = interaction.options.getString('datetime')
    }

    let next = util.getNextEventTimestamp() * 1000;

    if (input != 'null' && input != null) {
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        if (!input.match(regex)) {
            await interaction.editReply(`Invalid date: ${input}`);
            return;
        } else {
            next = new Date(input).getTime();
        }
    }

    for (let event of await interaction.guild.scheduledEvents.fetch()) {
        const time = event[1].scheduledStartTimestamp;
        const name = event[1].name;
        const descript = event[1].description;
        const id = event[1].id;

        let nextMovie = await statesDB.getState('nextmovie');
        nextMovie = JSON.parse(nextMovie.get()['data']);
        nextMovie = nextMovie === 'null' ? null : nextMovie;

        const titlePattern = /Movie Night/;

        if (next === time && name.match(titlePattern)) {
            const regex = /\*\*.+\*\*/;
            if (!descript.match(regex) && nextMovie != null) {
                interaction.guild.scheduledEvents.edit(await interaction.guild.scheduledEvents.fetch(id), {
                    description: `The next Movie Night is soon!\n` +
                        `Movie: **${nextMovie.title} (${nextMovie.year})**.\n` +
                        `To watch the movie with us, join <#${channels[interaction.guild.id].movie_voice_channel}> <t:${next / 1000}:R>!`,
                    name: `Movie Night - ${nextMovie.title} (${nextMovie.year})`
                });
                await interaction.editReply(`The event has been updated with the movie **${nextMovie.title} (${nextMovie.year})**.`);
                return;
            }
            await interaction.editReply(`There is already a Movie Night scheduled for <t:${next / 1000}:f>.`);
            return;
        }
    }

    let nextMovie = await statesDB.getState('nextmovie');
    nextMovie = JSON.parse(nextMovie.get()['data']);
    nextMovie = nextMovie === 'null' ? null : nextMovie;


    let description = `The next Movie Night is soon!\n`;
    if (movie) {
        description += `Movie: **${movie.title} (${movie.year})**\n`;
        var name = `Movie Night - ${movie.title} (${movie.year})`;
    } else {
        if (nextMovie != null) {
            description += `Movie: **${nextMovie.title} (${nextMovie.year})**\n`;
            var name = `Movie Night - ${nextMovie.title} (${nextMovie.year})`;
        } else {
            var name = `Movie Night`;
        }
    }

    description += `To watch the movie with us, join <#${channels[interaction.guild.id].movie_voice_channel}> <t:${next / 1000}:R>!`

    const c = await interaction.guild.channels.fetch(channels[interaction.guild.id].movie_voice_channel);

    const event = await interaction.guild.scheduledEvents.create({
        name: name,
        description: description,
        scheduledStartTime: next,
        channel: c,
        entityType: 2,
        privacyLevel: 2,
        reason: `The /createevent command was used by ${interaction.user.tag}.`,
        image: 'http://gownerjones.com/images/movienight.png'
    });
    await interaction.editReply(`${event.name} was scheduled for <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:f>`);
    return;
}

module.exports = { handler };