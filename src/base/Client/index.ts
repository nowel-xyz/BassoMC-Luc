import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import mysql from "mysql2";
import IClient from "../interface/IClient";
import IConfig from "../interface/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export default class CustomClient extends Client implements IClient {
    public developmentMode: boolean;
    public config: IConfig;
    private handler: Handler
    public commands: Collection<string, Command>;
    public subCommands: Collection<string, SubCommand>;
    public cooldowns: Collection<string, Collection<string, number>>;
    public database: Connection;

    constructor() {
        super({ 
            intents: [
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.MessageContent, 
                GatewayIntentBits.GuildMessages, 
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.GuildMembers,
            ] 
        })
        this.handler = new Handler(this)
        this.commands = new Collection()
        this.subCommands = new Collection()
        this.cooldowns = new Collection()
        this.config = require(`${process.cwd()}/data/config.json`)
        this.developmentMode = (process.argv.slice(2).includes("--development"))
        this.database = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
    }

    public async Init(): Promise<void> {
        console.log(`Starting the bot in ${this.developmentMode ? "development" : "production"}`)

        try {
            this.database.execute(`
                CREATE TABLE IF NOT EXISTS data (
                    id INT AUTO_INCREMENT PRIMARY KEY, 
                    username VARCHAR(255) NULL, 
                    message VARCHAR(255) NULL
                );
            `);        
        } catch (error) {
            console.error(`[MySQL] - Error while creating database table!\n${error}`);
        }

        try {
            this.login(process.env.DISCORD_TOKEN)    
        } catch (error) {
            console.error(`[DiscordBot] - Error: ${error}`)   
        }

        try {
            this.handler.LoadCommands()
            this.handler.LoadEvents()
        } catch (error) {
            console.error(`[Handler] - Error ${error}`)
        }
    }



    
} 