require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

bot.commands = new Collection();
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		bot.once(event.name, (...args) =>
			event.execute(...args, bot),
		);
	} else {
		bot.on(event.name, (...args) =>
			event.execute(...args, bot),
		);
	}
}

const CommandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(CommandsPath);

for (const folder of commandFolders) {
	const folderPath = path.join(CommandsPath, folder);
	const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filepath = path.join(folderPath, file);
		const command = require(filepath);

		if ("data" in command && "execute" in command) {
			bot.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filepath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

bot.login(process.env.BOT_TOKEN)