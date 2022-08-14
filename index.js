global.env = "prod";

const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, omdbtoken } = require('./configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const util = require('./common/util.js');
const { selecthandler } = require('./handlers/selecthandler.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const states = JSON.parse(fs.readFileSync('states.json'));

global.submitting = states.submitting;
global.polling = states.polling;
global.monthly_movies = 8;
global.nextmovie = states.nextmovie;

setInterval(function () {
	console.log('Saving states...');
	fs.writeFileSync('states.json', JSON.stringify({
		submitting: global.submitting,
		polling: global.polling,
		nextmovie: global.nextmovie,
		monthly_movies: global.monthly_movies
	}))
	console.log(`
	submitting: ${global.submitting}\n
	polling: ${global.polling}\n
	nextmovie: ${global.nextmovie.title} (${global.nextmovie.year})\n
	monthly_movies: ${global.monthly_movies}\n
	`)
	console.log('States saved.');
}, 3600000 / 2);


console.log(states);


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (interaction.isChatInputCommand()) {

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			console.log(`${interaction.user.tag} (${interaction.user.id}) used /${interaction.commandName} on ${interaction.guild.name}`);
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	else if (interaction.isSelectMenu()) {
		selecthandler(interaction);
	}

	else {
		return;
	}
});

client.login(token);

client.once('ready', () => {
	util.startupInfo(client);
});