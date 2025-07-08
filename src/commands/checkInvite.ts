import { MessageFlags, ChatInputCommandInteraction, ContainerBuilder, TextDisplayBuilder, ThumbnailBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, MediaGalleryBuilder, MediaGalleryItemBuilder } from 'discord.js';
import { errorComp } from '../utils/error';
import { Invite } from '../types/checkInvite';
import axios from 'axios';

// Command execution logic
export async function executeCommand(interaction: ChatInputCommandInteraction) {
    let code = interaction.options.getString('code', true);
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    // Parse invite code from full invite links or allow direct code
    const inviteRegex = /(?:https?:\/\/)?(?:www\.)?discord(?:app)?\.gg\/([a-zA-Z0-9-]+)/i;
    const match = code.match(inviteRegex);
    if (match) {
        code = match[1];
    }

    try {
        // Fetch invite data from Discord API
        const res = await axios.get(`https://discord.com/api/v10/invites/${code}?with_counts=true&with_expiration=true`);
        const data = res.data as Invite;

        // Guild-related info
        const guild = data.guild;
        const guildId = guild.id;
        const guildName = guild.name;
        const guildIconUrl = guild.icon ? `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.png` : undefined;
        const guildBannerUrl = guild.banner ? `https://cdn.discordapp.com/banners/${guildId}/${guild.banner}.png?size=4096` : undefined;
        const guildSplashUrl = guild.splash ? `https://cdn.discordapp.com/splashes/${guildId}/${guild.splash}.png?size=4096` : undefined;
        const guildVanityUrl = guild.vanity_url_code;
        const guildPremiumTier = guild.premium_tier;
        const guildPremiumCount = guild.premium_subscription_count;
        const guildDescription = guild.description;

        // Channel-related info
        const channel = data.channel;
        const channelName = channel?.name;

        // Profile-related info (may contain member/online counts, description)
        const profile = data.profile;
        const profileDescription = profile.description;
        const profileMemberCount = profile.member_count;
        const profileOnlineCount = profile.online_count;

        // Inviter-related info
        const inviter = data.inviter;
        const inviterId = inviter?.id;
        const inviterUsername = inviter?.username;
        const inviterGlobalName = inviter?.global_name;
        const inviterAvatarUrl = inviter?.avatar ? `https://cdn.discordapp.com/avatars/${inviterId}/${inviter.avatar}.png` : undefined;
        const inviterClanTag = inviter?.clan.tag;

        // Invite-related info
        const inviteExpiresAt = data.expires_at ? `<t:${Math.floor(new Date(data.expires_at).getTime() / 1000)}:R>` : `\`Never\``;
        const inviteUses = data.uses;
        const inviteMaxUses = data.max_uses;

        // Prefer member/online counts from profile, fallback to root, then 'Unknown'
        const memberCount = profileMemberCount || data.approximate_member_count;
        const onlineCount = profileOnlineCount || data.approximate_presence_count;
        // Prefer description from guild, then profile, then fallback
        const description = guildDescription || profileDescription || 'No description.';

        // Media gallery: prefer banner, then splash
        const mediaGalleryUrl = guildBannerUrl || guildSplashUrl;

        // Build a detailed embed with as much info as possible, each field on its own line
        const components = [
            (() => {
                const container = new ContainerBuilder()
                    .setAccentColor(5793266) // Discord Blue
                    .addSectionComponents(
                        new SectionBuilder()
                            .setThumbnailAccessory(
                                new ThumbnailBuilder()
                                    .setURL(guildIconUrl || '')
                                    .setDescription(description)
                            ).addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(`# ${guildName}`),
                                new TextDisplayBuilder().setContent(description),
                            ),
                    );

                // Add guild info in a similar style as inviter
                if (guild) {
                    const guildProfile = [
                        `**ID:** \`${guildId}\``,

                        memberCount ? `**Members:** \`${memberCount}\`` : null,
                        onlineCount ? `**Online:** \`${onlineCount}\`` : null,
                        (inviteUses && inviteMaxUses) ? `**Uses:** \`${inviteUses}/${inviteMaxUses}\`` : null,
                        channelName ? `**Channel:** \`${channelName}\`` : null,
                        inviteExpiresAt ? `**Expires:** ${inviteExpiresAt}` : null,
                        (guildVanityUrl && code === guildVanityUrl) ? null : `**Invite:** https://discord.gg/${code}`,
                        guildVanityUrl ? `**Vanity:** https://discord.gg/${guildVanityUrl}` : null,
                        guildPremiumTier ? `**Boost Tier:** \`${guildPremiumTier}\`` : null,
                        guildPremiumCount ? `**Boosts:** \`${guildPremiumCount}\`` : null,
                    ].filter(Boolean).join('\n');
                    container.addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                    ).addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`## **Guild**`),
                        new TextDisplayBuilder().setContent(guildProfile),
                    );
                }

                // Add inviter info if present
                if (inviter) {
                    const inviterProfile = [
                        inviterId ? `**ID:** \`${inviterId}\`` : null,
                        inviterUsername ? `**Username:** \`${inviterUsername}\`` : null,
                        inviterGlobalName ? `**Global Name:** \`${inviterGlobalName}\`` : null,
                        inviterId ? `**Mention:** <@${inviterId}>` : null,
                        inviterClanTag ? `**Tag:** \`${inviterClanTag}\`` : null,
                    ].filter(Boolean).join('\n');
                    container.addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                    ).addSectionComponents(
                        new SectionBuilder()
                            .setThumbnailAccessory(
                                new ThumbnailBuilder()
                                    .setURL(inviterAvatarUrl || '')
                                    .setDescription(inviterUsername ? inviterGlobalName || '' : '')
                            )
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(`## **Inviter**`),
                                new TextDisplayBuilder().setContent(inviterProfile),
                            )
                    );
                }

                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`**API URL:** https://discord.com/api/v10/invites/${code}?with_counts=true&with_expiration=true`),
                );

                if (mediaGalleryUrl) {
                    container.addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(mediaGalleryUrl)
                            ),
                    );
                }
                return container;
            })(),
        ];

        // Send the response
        await interaction.reply({ components, flags: ephemeral ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] : MessageFlags.IsComponentsV2 });
    } catch (err) {
        await errorComp(interaction, `${code} is not a valid invite code.\nPlease check the code and try again.\n[API URL](https://discord.com/api/v10/invites/${code}?with_counts=true&with_expiration=true)`);
    }
}
