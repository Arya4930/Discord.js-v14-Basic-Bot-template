const { Events, Collection } = require('discord.js')
const cooldowns = new Collection();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, bot) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        if (!interaction.isChatInputCommand()) return;
            const userId = await interaction.user.id
            if (command.cooldown) {
                const { cooldown } = command;

                const lastUsed = cooldowns.get(userId)?.[command.name] || 0;
                const timeLeft = lastUsed + cooldown - Date.now();

                if (timeLeft > 0) {
                    return await interaction.reply({ content: `Please wait ${timeLeft / 1000} seconds before using this command again.`, ephemeral: true });
                }
                if (!cooldowns.has(userId)) {
                    cooldowns.set(userId, {});
                }

                cooldowns.get(userId)[command.name] = Date.now();
            }
            if (command.AdminOnly) {
                const { AdminOnly } = command;

                if (AdminOnly === true && !Botadmins.includes(userId)) {
                    return interaction.reply({ content: 'Only bot admins are allowed to use this command!', ephemeral: true })
                }
            }
            try {
                await command.execute(interaction, bot);
            } catch (error) {
                console.log(error)
                await interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true })
            }
    }
}
