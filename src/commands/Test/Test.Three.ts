import { ApplicationCommandOptionType, ChatInputCommandInteraction, MessageFlags, PermissionsBitField } from "discord.js";
import CustomClient from "../../base/Client";
import Command from "../../base/Client/Command";
import Category from "../../base/enums/Category";
import { RowDataPacket } from "mysql2";

export default class TestThree extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "db",
            description: "Group of commands.",
            category: Category.Utilities,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    name: "save_echo",
                    description: "Save to the database & echo back what's inside. (2)",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "string",
                            description: "Input string.",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                    ]
                }
            ],
            dev: true,
            bot_permissions: null
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        let input = interaction.options.getString("string")
        let conn = new CustomClient().conn;

        conn.execute(`INSERT INTO data (username,message) VALUES (?,?);`, [interaction.user.username, input])
        const awns = await conn.query<data[]>(
            `SELECT * FROM data ORDER BY \`name\` ASC;`
        );

        interaction.reply({ content: `Fetched messages successfully!`, flags: [MessageFlags.Ephemeral] })

        for (const row in awns) {
            interaction.followUp({ content: ` * ${row}`})
        }

        conn.end();
    }
}

interface data extends RowDataPacket {
    id: number,
    username: string,
    message: string
}