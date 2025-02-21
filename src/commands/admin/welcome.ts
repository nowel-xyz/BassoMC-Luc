import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, MessageFlags, PermissionsBitField } from "discord.js";
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
                            channel_types: [ ChannelType.GuildText, ChannelType.GuildAnnouncement ],
                            required: true
                        },
                        {
                            name: "message",
                            description: "Use {USER} to display the joining user's username && {SERVER} for the guild's name.",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: "embed",
                            description: "Does the bot send a embed on a join ?",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        },
                        {
                            name: "timestamp",
                            description: "Does the embed include the timestamp of the join ?",
                            type: ApplicationCommandOptionType.Boolean
                        },
                        {
                            name: "footer",
                            description: "Footer of embed, leave empty to send nothing.",
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: "footer_pfp",
                            description: "Does the bot use the player's PFP as footer image in the embed?",
                            type: ApplicationCommandOptionType.Boolean,
                        },
                        {
                            name: "title",
                            description: "Title of embed, use {USER} to display the joining user's username. Leave empty to not use a title.",
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: "thumbnail",
                            description: "Thumbnail of embed, leave empty to not use a thumbnail.",
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: "image",
                            description: "Image of embed, leave empty to not use a image.",
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: "color",
                            description: "Color of the embed on user join.",
                            type: ApplicationCommandOptionType.String
                        },
                    ]
                },
                {
                    name: "fakejoin",
                    description: "Emit a join event.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                },
            ],
            dev: true,
            bot_permissions: [ PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ViewChannel ]
        });
    }


    async Execute(interaction: ChatInputCommandInteraction) {}
}