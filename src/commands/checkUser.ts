import { Client, MessageFlags, User, ChatInputCommandInteraction, ContainerBuilder, TextDisplayBuilder, ThumbnailBuilder, SectionBuilder } from 'discord.js';
import { parseBadges } from '../utils/parseBadges';
import { errorComp } from '../utils/error';

// Dev variables

// Raw badge display
const showRawBadges = false;

// Command execution logic
export async function executeCommand(client: Client, interaction: ChatInputCommandInteraction) {
    let userID = interaction.options.getString('userid', true);
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    // Check if the input is a mention or a user ID
    const mentionRegex = /^<@!?(\d+)>$/;
    const match = userID.match(mentionRegex);
    if (match) {
        userID = match[1];
    }

    try {
        // Fetch user data from Discord API
        const data: User = await client.users.fetch(userID, { cache: false });
        // User-related info
        const userId = data.id;
        const username = data.username;
        const globalName = data.globalName;
        const createdTimestamp = data.createdTimestamp;

        const flags = data.flags?.toArray();
        const badgeEmojis = flags && flags.length > 0 ? parseBadges(flags.map(flag => flag.toString())) : null;
        const rawBadges = flags && flags.length > 0 ? flags.map(flag => `\`${flag.toString()}\``).join(', ') : null;

        // Get avatar and banner URLs if available
        const avatarUrl = data.avatarURL() || data.defaultAvatarURL;

        const isBot = data.bot ? true : false;
        const isSystem = data.system ? true : false;
        const isVerifiedBot = flags?.includes('VerifiedBot');

        // Create a container for the response
        const components = [
            (() => {
                const container = new ContainerBuilder()

                // Prepare user data for display
                const userData = [
                    `**Username:** \`${username}\``,
                    globalName ? `**Global Name:** \`${globalName}\`` : null,
                    `**ID:** \`${userId}\``,
                    `**Mention:** <@${userId}>`,
                    `**Created:** <t:${Math.floor(createdTimestamp / 1000)}:R>`,
                    badgeEmojis ? `**Badges:** ${badgeEmojis}` : null,
                    showRawBadges && rawBadges ? `**Raw Badges:** ${rawBadges}` : null,
                    isBot
                        ? isVerifiedBot
                            ? `**This user is a verified bot**`
                            : `**This user is a bot**`
                        : null,
                    isSystem ? `**This user is a system account**` : null,
                ].filter(Boolean).join('\n');

                // Set accent color and add user info section
                container.setAccentColor(5793266) // Discord Blue
                    .addSectionComponents(
                        new SectionBuilder()
                            .setThumbnailAccessory(
                                new ThumbnailBuilder()
                                    .setURL(avatarUrl || '')
                            ).addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(userData),
                            ),
                    );

                return container;
            })(),
        ];

        // Send the response
        await interaction.reply({ components, flags: ephemeral ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] : MessageFlags.IsComponentsV2 });
    } catch (error) {
        await errorComp(interaction, 'Failed to fetch user information. Please check the user ID or mention.');
    }
}
