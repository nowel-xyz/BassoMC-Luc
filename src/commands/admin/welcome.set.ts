import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import CustomClient from "../../base/Client";
import SubCommand from "../../base/Client/SubCommand";

export default class WelcomeSET extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "welcome.set",
            
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        this.client.database.execute(`
            CREATE TABLE IF NOT EXISTS welcome (
                id INT AUTO_INCREMENT PRIMARY KEY NULL,
                guildid BIGINT(255) NULL,
                channel BIGINT(255) NULL,
                title VARCHAR(255) NULL,
                message VARCHAR(255) NULL,
                embed TINYINT(1) NULL,
                color VARCHAR(255) NULL,
                timestamp TINYINT(1) NULL,
                footer VARCHAR(255) NULL,
                usepfpfooter TINYINT(1) NULL,
                image_url VARCHAR(255) NULL,
                thumbnail_url VARCHAR(255) NULL
            );
        `);

        if (interaction.options.getBoolean("embed") == true) {
            if (interaction.options.getBoolean("timestamp") != null && interaction.options.getBoolean("footer_pfp") != null) {
                let title = interaction.options.getString("title") ?? ""
                let desc = interaction.options.getString("message") ?? ""
                const welcEmb = new EmbedBuilder()
                    .setColor(interaction.options.getString("color") as ColorResolvable)
                    .setDescription(desc.replace("{USER}", interaction.user.username).replace("{SERVER}", interaction.guild?.name ?? "N/A"))

                if (interaction.options.getString("title") != null) {
                    welcEmb.setTitle(title.replace("{USER}", interaction.user.username))
                } 
                if (interaction.options.getBoolean("timestamp") == true) {
                    welcEmb.setTimestamp();
                }
                if (interaction.options.getBoolean("footer_pfp") == true) {
                    welcEmb.setFooter({ iconURL: interaction.user.displayAvatarURL(), text: interaction.options.getString('footer') ?? "No footer set. (using footer image!)" })
                } else {
                    if (interaction.options.getString('footer') != null) {
                        welcEmb.setFooter({ text: `${interaction.options.getString("footer")}` })
                    }
                }
                if (interaction.options.getString("thumbnail") != null) {
                    welcEmb.setThumbnail(interaction.options.getString("thumbnail"))
                }
                if (interaction.options.getString("image") != null) {
                    welcEmb.setImage(interaction.options.getString("image"))
                }

                this.client.database.execute(`
                    INSERT INTO welcome (
                        guildid,
                        channel,
                        title,
                        message,
                        embed,
                        color,
                        timestamp,
                        footer,
                        usepfpfooter,
                        image_url,
                        thumbnail_url
                    ) VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    );
                `, [interaction.guild?.id.toString(), interaction.options.getChannel("channel")?.id.toString(), interaction.options.getString("title"), interaction.options.getString("message"), interaction.options.getBoolean("embed"), interaction.options.getString("color"), interaction.options.getBoolean("timestamp"), interaction.options.getString("footer"), interaction.options.getBoolean("footer_pfp"), interaction.options.getString("image_url"), interaction.options.getString("thumbnail_url")])

                await interaction.reply({ content: `Successfully set a welcome message for ${interaction.options.getChannel("channel")}! Here's how I will be sending welcome messages from now on:`, embeds: [welcEmb] });
            } else {
                await interaction.reply({ content: "You are missing one or more required options for an embed!" });
            }
        } else {
            this.client.database.execute(`
                INSERT INTO welcome (
                    guildid,
                    channel,
                    message,
                    embed
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?
                );
            `, [interaction.guild?.id, interaction.options.getChannel("channel")?.id, interaction.options.getString("message"), interaction.options.getBoolean("embed")])

            await interaction.reply({ content: `Successfully set a welcome message for ${interaction.options.getChannel("channel")}! Here's how I will be sending welcome messages from now on:\n\n${interaction.options.getString("message")?.replace("{USER}", interaction.user.username).replace("{SERVER}", interaction.guild?.name ?? "N/A")}` });
        }
    }
}