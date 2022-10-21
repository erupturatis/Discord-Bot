const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()


const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,

] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.once(Events.MessageCreate, msg =>{
    console.log(msg)
})

client.login(process.env.TOKEN);