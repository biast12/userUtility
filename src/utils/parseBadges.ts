import process from 'process';
import badges from './badges.json';

// Type definition for badge object
type Badge = { FlagName: string; EmojiName: string; EmojiIDEnv: string; };

// Build badge map from JSON and .env
const badgeEmojiMap: Record<string, string> = {};
for (const badge of badges as Badge[]) {
    const emojiId = process.env[badge.EmojiIDEnv];
    if (emojiId) {
        badgeEmojiMap[badge.FlagName] = `<:${badge.EmojiName}:${emojiId}>`;
    }
}

export function parseBadges(flags: string[]): string {
    return flags
        .map(flag => badgeEmojiMap[flag] || '')
        .filter(Boolean)
        .join(' ');
}

