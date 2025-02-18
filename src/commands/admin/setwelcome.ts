import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/Client/Command";
import CustomClient from "../../base/Client";
import Category from "../../base/enums/Category";

export default class devCommand extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "welcome",
            description: "Commands for changing/setting the welcome message!",
            category: Category.Utilities,
            default_member_permissions: PermissionsBitField.Flags.ManageChannels,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "set",
                    description: "Modify welcome channel/message!",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "the Channel to send welcome messages to!",
                            type: ApplicationCommandOptionType.Channel,
                            channel_types: [ ChannelType.GuildText, ChannelType.GuildAnnouncement   ],
                            required: true
                        },
                        {
                            name: "embed",
                            description: "Does the bot send a embed on a join ?",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        },
                        {
                            name: "embed_color",
                            description: "Does the bot send a embed on a join ?",
                            type: ApplicationCommandOptionType.String
                        },
                    ]
                },
            ],
            dev: true,
            bot_permissions: [ PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ViewChannel ]
        });
    }


    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: "A Dev command" });
    }
}