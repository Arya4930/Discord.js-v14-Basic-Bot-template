const { REST, Routes } = require('discord.js');
const fs = require('node:fs')
const bot = require('./index')

const commands = []
const commandFolders = fs.readdirSync('./src/commands');

for (const folder of commandFolders) {
    const folderPath = `./src/commands/${folder}`;
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const CommandPath = `../src/commands/${folder}/${file}`
        const command = require(CommandPath);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log(`| ✅ Started refreshing ${commands.length} application (/) commands.`)

        const data = await rest.put(
            Routes.applicationCommands(process.env.ClientID),
            { body: commands },
        );

        console.log(`| ✅ Successfully reloaded ${data.length} application (/) commands. `)
    }
    catch (error) {
        console.log(error);
    }
})();