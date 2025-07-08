import { ChatInputCommandInteraction, MessageFlags, ContainerBuilder, TextDisplayBuilder } from 'discord.js';

export async function errorComp(interaction: ChatInputCommandInteraction, errorMsg: string) {
    const components = [new ContainerBuilder()
        .setAccentColor(0xED4245) // Discord red
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`❌ - **ERROR**`)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(errorMsg)
        )];

    const flags = MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral;
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ components, flags });
    } else {
        await interaction.reply({ components, flags });
    }
}
