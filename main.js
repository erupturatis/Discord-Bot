import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
import {getNamesForDistance} from './Functionality/wikipediaScraper.js'
    

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,

] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    const BOT_ID = client.user;
    const BOT_USERNAME = client.user;
    console.log(client.user);
});

async function manageScraping(root){
    let names = await getNamesForDistance(root, 0, 1);
    console.log(names);
    console.log("here");
}


client.addListener(Events.MessageCreate, msg =>{
    let content = msg.content;
    let user = msg.author.username;
    let isBot =  msg.author.bot;
    
    if (content == 'wiki'){
        msg.reply("merge");
    }
})

client.login(process.env.TOKEN)

