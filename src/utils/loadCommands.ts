import { MessageFlags, Client, ChatInputCommandInteraction } from 'discord.js';
import { checkCommandBuilder } from './commandBuilder';

// Interface for loaded command modules
export interface LoadedCommand {
  data: any; // Replace with correct type if available for checkCommandBuilder
  execute?: (client: Client, interaction: ChatInputCommandInteraction) => Promise<any>;
}

interface LoadCommandsOptions {
  withExecute?: boolean;
}

// Loads all commands (now only the shared builder)
export function loadCommands(options?: LoadCommandsOptions): LoadedCommand[] {
  // Only return the shared command builder
  const commands: LoadedCommand[] = [];
  if (options?.withExecute) {
    commands.push({
      data: checkCommandBuilder,
      async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();
        if (sub === 'invite') {
          const { executeCommand } = require('../commands/checkInvite');
          return executeCommand(interaction);
        }
        if (sub === 'user') {
          const { executeCommand } = require('../commands/checkUser');
          return executeCommand(client, interaction);
        }
        if (sub === 'baddomain') {
          const { executeCommand } = require('../commands/checkBadDomain');
          return executeCommand(interaction);
        }
        await interaction.reply({ content: 'Unknown subcommand.', flags: MessageFlags.Ephemeral });
      }
    });
  } else {
    commands.push({ data: checkCommandBuilder });
  }
  return commands;
}
