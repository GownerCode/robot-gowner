const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watched')
        .setDescription('Shows all movies that have been watched so far.'),
    async execute(interaction) {
        let movielist = JSON.parse(fs.readFileSync('./lists/viewed.json'));
        if (interaction.guild.id in movielist) {
            movielist = movielist[interaction.guild.id]['watched'];
            let liststring = '';
            for (let x = 0; x < movielist.length; x++) {
                const watchdate = movielist[x].watchdate;
                const date = Date.parse(`${watchdate.slice(0, 4)}-${watchdate.slice(4, 6)}-${watchdate.slice(6, 8)}`);
                liststring += `${x + 1}. ***${movielist[x].title} (${movielist[x].year})*** watched on <t:${date / 1000}:D>\n`;
            }
            liststring += `\n In total, **${movielist.length}** ${movielist.length > 1 ? 'movies' : 'movie'} ${movielist.length > 1 ? 'have' : 'has'} been watched.`
            await interaction.reply(liststring);
        } else {
            await interaction.reply(`No movies have been watched yet.`)
        }
    },
};