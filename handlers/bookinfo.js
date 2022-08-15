const { EmbedBuilder } = require('discord.js');
const { gbooksApi } = require('../configuration/access_config.json')[global.env];
const util = require('../common/util.js')
const gbooks = require('node-google-books-search-promise');

function parseHTML(text) {
    text = text.replace(/<p>/g, '');
    text = text.replace(/<\/p>/g, '\n\n');
    text = text.replace(/<b>/g, '**');
    text = text.replace(/<\/b>/g, '**');
    text = text.replace(/<br>/g, '\n');
    text = text.replace(/<i>/g, '*');
    text = text.replace(/<\/i>/g, '*');
    text = text.replace(/<ul>/g, '');
    text = text.replace(/<\/ul>/g, '\n')
    text = text.replace(/<li>/g, '\t- ');
    text = text.replace(/<\/li>/g, '\n');
    text = text.replace(/(( *\n *){3,})/gm, '\n\n');

    return text;
}

async function handler(interaction) {
    await interaction.deferReply();

    const id = interaction.values[0];
    const reply = await gbooks.lookup(id);
    const result = reply.result;

    var authorValue = '';
    if (result.authors) {
        result.authors.forEach(author => {
            authorValue += `${author}, `;
        });

        authorValue = authorValue.slice(0, -2);
    } else {
        authorValue = 'Anonymous'
    }

    var titleValue = `${result.title}${result.subtitle ? ': ' + result.subtitle : ''}`

    if (result.description) {
        var description = parseHTML(result.description);
    }


    const infoEmbed = new EmbedBuilder()
        .setColor(0xff00e6)
        .setTitle(titleValue)
        .setAuthor({ name: result.authors ? result.authors[0] : 'Anonymous' })
        .setImage(result.thumbnail)
        .setURL(result.link)
        .setThumbnail(result.thumbnail)
        .addFields(
            { name: 'Description:', value: description ? (description.length > 1000 ? description.slice(0, description.slice(0, 1000).lastIndexOf(' ')) + '...' : description) : 'N/A' },
            { name: '\u200B', value: '\u200B' },

            { name: 'Author(s):', value: authorValue, inline: true },
            { name: 'Publisher:', value: result.publisher, inline: true },
            { name: 'Published:', value: result.publishedDate, inline: true },
            { name: 'Pages:', value: `${result.pageCount ? result.pageCount : 'N/A'}`, inline: true },


        )
        .setTimestamp()
        .setFooter({ text: 'powered by Robot-Gowner', iconURL: 'http://gownerjones.com/images/avatar.jpg' });

    await interaction.editReply({ embeds: [infoEmbed] });
    return;

}

module.exports = { handler };