const fs = require('fs');

async function handler(interaction) {

    const title = interaction.values[0].split('+.-,')[1];
    const imdbid = interaction.values[0].split('+.-,')[0];
    const year = interaction.values[0].split('+.-,')[2];
    const viewedlist = JSON.parse(fs.readFileSync('lists/viewed.json'));

    await interaction.update({ content: 'Movie selected.', components: [] });

    if (!(interaction.guild.id in viewedlist)) {
        viewedlist[interaction.guild.id] = {
            watched: []
        }
    }

    for (let i = 0; i < viewedlist[interaction.guild.id]['watched'].length; i++) {
        if (viewedlist[interaction.guild.id]['watched'][i].imdbid === imdbid) {
            interaction.channel.send(`***${title}*** has already been added to the watched list.`);
            return;
        }
    }

    viewedlist[interaction.guild.id]["watched"].push({
        title: title,
        imdbid: imdbid,
        year: year,
        watchdate: new Date().toISOString().slice(0, 10).replace(/-/g, "")
    })
    fs.writeFileSync('lists/viewed.json', JSON.stringify(viewedlist));
    global.nextmovie = null;
    interaction.channel.send(`***${title}*** has been added to the watched movies list!`);
}

module.exports = { handler };