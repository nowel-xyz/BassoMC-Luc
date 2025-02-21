import { ColorResolvable, Embed, EmbedBuilder, Events, Guild, GuildMember } from "discord.js";
import Event from "../../base/Client/Event";
import CustomClient from "../../base/Client";
import { RowDataPacket } from "mysql2";


export default class GuildCreate extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildMemberAdd,
            description: "Guild member join events",
            once: false
        })
    }

    async Execute(member: GuildMember) {
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
        
        this.client.database.query<RowDataPacket[]>(`SELECT * FROM welcome WHERE guildid = ? AND id = (SELECT MAX(id) AS id FROM welcome WHERE guildid = ?)`, [member.guild.id, member.guild.id], function (err,result) {
            if (err) {
                throw err;
            }
            if (JSON.stringify(result) == "[]") {
                return;
            }

            const channel = member.guild.channels.cache.get(result[0].channel);
            
            if (!channel) {
                console.log(`[Err] - Invalid channel being used in ${member.guild.name} (${member.guild.id})`);
                return;
            }

            if (channel.isSendable()) {
                if (result[0].embed != true) {
                    channel.send(result[0].message.replace("{USER}", member.user.username).replace("{SERVER}", member.guild.name ?? "N/A"))
                } else {
                    const welcEmb = new EmbedBuilder()
                        .setColor(result[0].color as ColorResolvable)
                        .setDescription(result[0].message.replace("{USER}", member.user.username).replace("{SERVER}", member.guild.name ?? "N/A"))

                    if (result[0].title != null) {
                        welcEmb.setTitle(result[0].title.replace("{USER}", member.user.username))
                    } 
                    if (result[0].timestamp == true) {
                        welcEmb.setTimestamp();
                    }
                    if (result[0].usepfpfooter == true) {
                        welcEmb.setFooter({ iconURL: member.user.displayAvatarURL(), text: result[0].footer ?? "No footer set. (using footer image!)" })
                    } else {
                        if (result[0].footer != null) {
                            welcEmb.setFooter({ text: `${result[0].footer}` })
                        }
                    }
                    if (result[0].thumbnail_url != null) {
                        welcEmb.setThumbnail(result[0].thumbnail_url)
                    }
                    if (result[0].image_url != null) {
                        welcEmb.setImage(result[0].image_url)
                    }

                    channel.send({ embeds: [welcEmb] })
                }
            }
        })
    }
}