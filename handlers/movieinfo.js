const { EmbedBuilder } = require('discord.js');
const { omdbtoken } = require('../configuration/access_config.json')[global.env];
const util = require('../common/util.js')
const omdb = new (require('omdbapi'))(omdbtoken);

async function handler(interaction, result) {
    if (!result) {
        const imdbid = interaction.values[0].split('+.-,')[0];
        result = await omdb.get({
            id: imdbid
        });
    }

    let genreValue = '';
    for (let value in result.genre) {
        genreValue += `${result.genre[value]}, `
    }
    genreValue = genreValue.slice(0, -2);

    let directorValue = '';
    for (let value in result.director) {
        directorValue += `${result.director[value]}, `
    }
    directorValue = directorValue.slice(0, -2);

    let actorValue = '';
    for (let value in result.actors) {
        actorValue += `${result.actors[value]}, `
    }
    actorValue = actorValue.slice(0, -2);

    let BOString = result.boxoffice != null ? result.boxoffice : 'N/A'
    if (BOString !== 'N/A' && parseInt(result.released.split(' ')[2]) !== new Date().getFullYear()) {
        let BONum = parseInt(BOString.split('$')[1].replace(/,/g, ''));
        let adjustedBONum = await util.getAdjustedPrice(BONum, parseInt(result.released.split(' ')[2]))
        var BOaString = Math.floor(adjustedBONum).toLocaleString();
        BOaString = '($' + BOaString + ')';
    } else {
        var BOaString = '';
    }

    for (let site in result.ratings) {
        if (result.ratings[site].source === 'Internet Movie Database') {
            var imdbString = result.ratings[site].value;
        } else if (result.ratings[site].source === 'Metacritic') {
            var metaString = result.ratings[site].value;
        } else if (result.ratings[site].source === 'Rotten Tomatoes') {
            var RTString = result.ratings[site].value;
        }
    }

    if (!RTString) {
        var RTString = 'N/A';
    }
    if (!metaString) {
        var metaString = 'N/A';
    }
    if (!imdbString) {
        var imdbString = 'N/A';
    }
    const infoEmbed = new EmbedBuilder()
        .setColor(0xff00e6)
        .setTitle(result.title)
        .setImage(result.poster)
        .setURL('https://imdb.com/title/' + result.imdbid)
        .setThumbnail(result.poster)
        .addFields(
            { name: 'Plot:', value: result.plot },
            { name: '\u200B', value: '\u200B' },
            { name: 'Language(s):', value: result.language, inline: true },
            { name: 'Director(s):', value: directorValue, inline: true },
            { name: 'Released:', value: `${result.released != null ? result.released : 'N/A'}`, inline: true },
            { name: 'Runtime:', value: `**${result.runtime}**`, inline: true },
            { name: 'Genre:', value: genreValue, inline: true },
            { name: 'Starring:', value: actorValue, inline: true },
            { name: 'IMDb:', value: `${imdbString}`, inline: true },
            { name: 'RT:', value: `${RTString}`, inline: true },
            { name: 'Metacritic:', value: `${metaString}`, inline: true },
            { name: `Box Office${BOaString !== '' ? ' (adjusted)' : ''}:`, value: `\n${BOString}\n${BOaString}` },

        )
        .setTimestamp()
        .setFooter({ text: 'Beep Boop - A service provided by Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' });

    await interaction.reply({ content: 'Info delivered.', ephemeral: true });
    await interaction.channel.send({ embeds: [infoEmbed] });

    return;
}

module.exports = { handler };