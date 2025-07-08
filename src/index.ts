// Import necessary Discord.js classes and utilities
import { Client, GatewayIntentBits, Interaction, MessageFlags } from 'discord.js';
import { loadCommands } from './utils/loadCommands';
import { errorComp } from './utils/error';
import 'dotenv/config';

// Create a new Discord client with Guilds intent
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: [] },
});

// Command handler setup
const commands = new Map();
// Load all commands from the commands directory
const loadedCommands = loadCommands({ withExecute: true });
for (const command of loadedCommands) {
  if (command.data && command.execute) {
    commands.set(command.data.name, command);
  }
}

// Log when the bot is ready
client.once('ready', () => {
  console.log(`✅ User Utility Bot is online as ${client.user?.tag}`);
});

// Listen for interactions (slash commands)
client.on('interactionCreate', async (interaction: Interaction) => {
  // Only handle chat input commands (slash commands)
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const command = commands.get(commandName);
  if (!command) return;
  try {
    // Execute the command (pass client as first argument)
    await command.execute(client, interaction);
  } catch (error) {
    console.error(`❌ Error executing utility command "${commandName}":`, error instanceof Error ? error.message : error);
    errorComp(interaction, 'An unexpected error occurred while processing your request.');
  }
});

// Log in to Discord with the bot token
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is not set in the environment variables.');
  process.exit(1);
}
client.login(process.env.BOT_TOKEN);
