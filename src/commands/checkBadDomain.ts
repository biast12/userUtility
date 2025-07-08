import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { errorComp } from '../utils/error';
import crypto from 'crypto';
import axios from 'axios';

// Command execution logic
export async function executeCommand(interaction: ChatInputCommandInteraction) {
    let domain = interaction.options.getString('domain', true).trim().toLowerCase();
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    // Add protocol if missing
    if (!/^https?:\/\//.test(domain)) {
        domain = 'https://' + domain;
    }

    // Validate domain using URL constructor
    let url: URL;
    let hostname: string;
    try {
        url = new URL(domain);
        hostname = url.hostname;
        // Basic check: must have at least one dot and no spaces
        if (!hostname.includes('.') || /\s/.test(hostname)) {
            throw new Error('Invalid domain');
        }
    } catch {
        await errorComp(interaction, 'Invalid domain format. Please provide a valid domain name (e.g., example.com).');
        return;
    }

    try {
        const res = await axios.get('https://cdn.discordapp.com/bad-domains/updated_hashes.json');
        const hashSet = new Set(res.data as string[])
        const domainHash = crypto.createHash('sha256').update(hostname).digest('hex');

        if (hashSet.has(domainHash)) {
            await interaction.reply({ content: `⚠️ The domain \`${hostname}\` **is on the bad domain list**.`, flags: ephemeral ? MessageFlags.Ephemeral : undefined });
        } else {
            await interaction.reply({ content: `✅ The domain ${url} is **not** on the bad domain list.`, flags: ephemeral ? MessageFlags.Ephemeral : undefined });
        }
    } catch (err) {
        await errorComp(interaction, 'Failed to check the bad domain list. Please try again later.');
    }
}
