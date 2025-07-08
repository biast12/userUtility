import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

// Helper to add the ephemeral boolean option
const addEphemeralOption = (sub: SlashCommandSubcommandBuilder) =>
    sub.addBooleanOption(option =>
        option.setName('ephemeral')
            .setDescription('Send the reply as ephemeral (only you can see it)')
            .setRequired(false)
    );

// Create a SlashCommandBuilder for the "check" command with subcommands
export const checkCommandBuilder = new SlashCommandBuilder()
    // Set the main command name and description
    .setName('check')
    .setDescription('User utility commands and information tools')
    // Add the "invite" subcommand for looking up invite codes
    .addSubcommand(sub =>
        addEphemeralOption(
            sub.setName('invite')
                .setDescription('Get information about a Discord invite')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('The invite code to look up')
                        .setRequired(true)
                )
        )
    )
    // Add the "user" subcommand for looking up user info
    .addSubcommand(sub =>
        addEphemeralOption(
            sub.setName('user')
                .setDescription('Get information about a Discord user')
                .addStringOption(option =>
                    option.setName('userid')
                        .setDescription('The user ID or mention to look up')
                        .setRequired(true)
                )
        )
    )
    // Add the "baddomain" subcommand for checking bad domains
    .addSubcommand(sub =>
        addEphemeralOption(
            sub.setName('baddomain')
                .setDescription('Check if a domain is flagged as malicious')
                .addStringOption(option =>
                    option.setName('domain')
                        .setDescription('The domain to check')
                        .setRequired(true)
                )
        )
    );
