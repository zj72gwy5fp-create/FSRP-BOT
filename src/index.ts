import dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import * as fs from "fs";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands: any[] = [];

// Load commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data && command.execute) {
    commands.push(command.data.toJSON());
  }
}

// Register commands
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);
(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });
    console.log("Commands registered!");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`Bot is online as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction: any) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commandFiles.find(f => f.replace(".js", "") === interaction.commandName);
  if (!command) return;
  try {
    const cmd = require(path.join(commandsPath, command));
    await cmd.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "Error executing command", ephemeral: true });
  }
});

client.login(process.env.BOT_TOKEN);