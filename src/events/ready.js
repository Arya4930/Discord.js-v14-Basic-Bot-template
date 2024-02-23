const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(interaction, bot) {
        console.log(`| ✅ Logged In as ${bot.user.tag}`)
        bot.user.setPresence({ activities: [{ name: `Tracking Jeff` }], status: 'dnd' });
    }
}