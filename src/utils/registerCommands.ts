import { REST, Routes } from 'discord.js';
import { checkCommandBuilder } from './commandBuilder';
import 'dotenv/config';

// Get the bot token from environment variables
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('❌ BOT_TOKEN is not set in the environment variables.');
  process.exit(1);
}

// Get the client ID from env or decode from token
let clientId = process.env.CLIENT_ID;
if (!clientId) {
  try {
    const tokenPart = token.split('.')[0];
    clientId = Buffer.from(tokenPart, 'base64').toString('utf8');
    if (!/^\d+$/.test(clientId)) throw new Error();
  } catch {
    console.error('❌ CLIENT_ID is not set and could not be decoded from BOT_TOKEN.');
    process.exit(1);
  }
}
if (!clientId) {
  console.error('❌ CLIENT_ID could not be determined.');
  process.exit(1);
}

// Use only the shared command builder for registration
const commands = [checkCommandBuilder.toJSON()];

// Create a new REST instance for Discord API
const rest = new REST({ version: '10' }).setToken(token);

async function deploy() {
  try {
    console.log('🔄 Refreshing application (/) utility commands...');

    // Register all commands globally
    await rest.put(
      Routes.applicationCommands(clientId!),
      { body: commands }
    );

    // Count subcommands as their own commands
    let totalCommands = 0;
    const commandList: string[] = [];
    for (const c of commands) {
      if (c.options && Array.isArray(c.options)) {
        for (const opt of c.options) {
          if (opt.type === 1) {
            totalCommands++;
            commandList.push(`  /${c.name} ${opt.name}`);
          }
        }
      } else {
        totalCommands++;
        commandList.push(`  /${c.name}`);
      }
    }

    // Log the registered commands
    console.log(`✅ Successfully registered ${totalCommands} user utility (/) commands:\n`);
    for (const line of commandList) {
      console.log(line);
    }
  } catch (error) {
    console.error('❌ Failed to register utility commands:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

deploy();
