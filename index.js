const { exit } = require('process');
require('dotenv').config();
if (process.env.ENVIRONMENT === 'development') {
	global.env = 'dev';
} else if (process.env.ENVIRONMENT === 'production') {
	global.env = 'prod';
} else {
	console.log('Environment not set or .env not found. Exiting.');
	exit(0);
}

require('./databaseDriver.js').init();

const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, omdbtoken } = require('./configuration/access_config.json')[global.env];
const omdb = new (require('omdbapi'))(omdbtoken);
const util = require('./common/util.js');
const { selecthandler } = require('./handlers/selecthandler.js');
const { Logger } = require('./common/logger.js');

global.startUpTime = new Date();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	var logger = new Logger()
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try {
			logger.logActivity(interaction);
			await command.execute(interaction);
			logger.updateStatus(logger.OK);
			return;

		} catch (error) {
			logger.updateStatus(logger.ERROR, error)
			await interaction.editReply({ content: 'There was an error while executing this command. Please try again.', ephemeral: true });
			return;
		}
	}
	else if (interaction.isSelectMenu()) {
		try {
			logger.logActivity(interaction);
			await selecthandler(interaction);
			logger.updateStatus(logger.OK);
			return;

		} catch (error) {
			logger.updateStatus(logger.ERROR, error)
			await interaction.editReply({ content: 'There was an error with this select menu. Please try again.', ephemeral: true });
			return;
		}

	}

	else {
		return;
	}
});

client.login(token);

client.once('ready', () => {
	util.startupInfo(client);
});