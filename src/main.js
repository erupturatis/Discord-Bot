import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
import { getNamesForDistance } from "./Functionality/wikipediaScraper.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  const BOT_ID = client.user;
  const BOT_USERNAME = client.user;
  console.log(client.user);
});

async function manageScraping(root) {
  let names = await getNamesForDistance(root, 0, 1);
  names = names.slice(0, 20);
  names = names.map((val) => {
    return val.link + ", \n";
  });
  console.log("finished names getting");
  //console.log(names);
  let finalMessage = "";
  finalMessage = finalMessage.concat(...names);
  return finalMessage;
}

client.addListener(Events.MessageCreate, async (msg) => {
  //extracting useful data
  let content = msg.content;
  let user = msg.author.username;
  let isBot = msg.author.bot;
  let channel = msg.channel;

  if (content.slice(0, 4) == "wiki") {
    content = content.slice(5);
    const newMessage = await msg.channel.send("Processing");

    let finalMessage = await manageScraping(`${content}`);
    console.log(finalMessage);
    await newMessage.edit(finalMessage);
  }
});

client.login(process.env.TOKEN);
