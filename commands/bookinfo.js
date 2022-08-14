const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const util = require('../common/util.js');
const { gbooksApi } = require('../configuration/access_config.json')[global.env];
const gbooks = require('google-books-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bookinfo')
        .setDescription('Get information on a book from Google Books.')
        .addStringOption(option =>
            option.setName('book')
                .setDescription('The book you want to see info on. (Title)')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const input = interaction.options.getString('book');



        var query = interaction.options.getString('book');
        var options = {
            key: gbooksApi,
        };
        gbooks.search(query, options, async function (error, result, apiResponse) {
            if (!error) {
                if (result.length < 1) {
                    await interaction.reply(`No books found for your query \`\`${query}\`\`. Please try again.`);
                    return;
                }
                let options = [];
                let ids = [];
                for (const [key, suggestion] of Object.entries(result)) {
                    if (ids.includes(suggestion.id)) {
                        continue;
                    }
                    options.push({
                        label: `${suggestion.title.length > 50 ? suggestion.title.slice(0, 50) : suggestion.title}${suggestion.authors ? ' by ' + (suggestion.authors[0].length > 50 ? suggestion.authors[0].slice(0, 50) : suggestion.authors[0]) : ''}`,
                        value: `${suggestion.id}`
                    });

                    ids.push(suggestion.id);

                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('bookinfo')
                            .setPlaceholder('Select book...')
                            .addOptions(options));
                await interaction.reply({ content: 'Which of these books do you want to know more about?', components: [row], ephemeral: true });
                return;
            } else {
                console.log(error);
                return;
            }
        });

    },
};



