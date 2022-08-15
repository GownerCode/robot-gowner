const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const util = require('../common/util.js');
const channels = require('../configuration/channels.json')[global.env];

async function handler(interaction) {
    if (interaction.isSelectMenu()) {
        const imdbid = interaction.values[0].split(',.-*')[0];
        var movie = await omdb.get({
            id: imdbid
        });

        var input = interaction.values[0].split(',.-*')[1];
    } else {
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

        if (next === time && name === 'Movie Night') {
            const regex = /\*\*.+\*\*/;
            if (!descript.match(regex) && global.nextmovie != null) {
                interaction.guild.scheduledEvents.edit(await interaction.guild.scheduledEvents.fetch(id), {
                    description: `The next Movie Night is soon!\n` +
                        `We will be watching **${global.nextmovie.title} (${global.nextmovie.year})**.\n` +
                        `Just hop on the movie voice channel to watch with us. See you then!`
                });
                await interaction.editReply(`The event has been updated with the movie **${global.nextmovie.title} (${global.nextmovie.year})**.`);
                return;
            }
            await interaction.editReply(`There is already a Movie Night scheduled for <t:${next / 1000}:f>.`);
            return;
        }
    }


    const name = 'Movie Night';
    let description = `The next Movie Night is soon!\n`;
    if (movie) {
        description += `We will be watching **${movie.title} (${movie.year})**.\n`;
    } else {
        if (global.nextmovie != null) {
            description += `We will be watching **${global.nextmovie.title} (${global.nextmovie.year})**.\n`
        }
    }

    description += `Just hop on the movie voice channel to watch with us. See you then!`

    const c = await interaction.guild.channels.fetch(channels.movie_voice_channel);

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