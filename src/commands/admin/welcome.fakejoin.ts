import { ChatInputCommandInteraction, Client, EmbedBuilder, MessageFlags } from "discord.js";
import CustomClient from "../../base/Client";
import SubCommand from "../../base/Client/SubCommand";
import { RowDataPacket } from "mysql2";

export default class FakeJoin extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "welcome.fakejoin",
            
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
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
        
        let tempClient = this.client;

        this.client.database.query<RowDataPacket[]>(`SELECT * FROM welcome WHERE guildid = ? AND id = (SELECT MAX(id) AS id FROM welcome WHERE guildid = ?)`, [interaction.guild?.id, interaction.guild?.id], function(err, results, fields){
            if (err) {
                interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`:x: Something went wrong! Try again later.`)], flags: [MessageFlags.Ephemeral] })
                throw err;
            }
            if (JSON.stringify(results) == "[]") {
                return interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`:x: You don't seem to have a welcome message setup. Please set one up using /welcome set!`)], flags: [MessageFlags.Ephemeral] })
            }

            if (interaction.guild != null) {
                tempClient.emit('guildMemberAdd', interaction.guild.members.cache.get(interaction.user.id)!);
            }
            interaction.reply({ content: `Emitted join event in <#${results[0].channel}>.`, flags: [MessageFlags.Ephemeral]})
        });
    }
}