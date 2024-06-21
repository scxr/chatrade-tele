const {Telegraf} = require("telegraf")
const {message} = require("telegraf/filters")
const makeWallet = require("./command_handlers/makeWallet")
const triageMessage = require("./message_handlers/triage")
const triageButtons = require("./button_handlers/triage")
const LocalSession = require("telegraf-session-local")
const {linkClient, linkClientListen, mainClient} = require("./constants/redis_shit")
require("dotenv").config()
const bot = new Telegraf(process.env.TOKEN)
const localSession = new LocalSession()
String.prototype.isNumber = function(){return /^\d+$/.test(this);}
linkClient.connect()
linkClientListen.connect()
mainClient.connect()
linkClient.on("connection", () => {
    console.log("Connected to redis")
})
linkClient.on("error", (err) => {
    console.log(`Error connecting to redis: ${err}`)
})

linkClientListen.pSubscribe("*", async (err, count) => {
    console.log("yay")
    console.log( err)
    if (err == "set") {} else if (err.length == "906239766872358992".length || !err.isNumber()) {

    } else {
        console.log("ERRR", err)
        
        let tuser = await linkClient.get(err)

        
        console.log("parsed user: ", tuser)
        let user = await linkClient.get(`${tuser}`)
        console.log(user)
        user = JSON.parse(user)

        await bot.telegram.sendMessage(err, `Your telegram account has been linked to the following discord account\n\nUsername: <code>${user.username}</code>\n Profile Link: <a href="https://discordapp.com/users/${user.uid}">Profile</a>`, {
            parse_mode: "HTML"
        })
    }
    
})

linkClientListen.on("pmessage", (pattern, channel, message) => {
    console.log(`Pattern: ${pattern} | Channel: ${channel} | Message: ${message}`);
})

bot.use(localSession.middleware())

bot.start(async (ctx) => {
    await ctx.reply("Hello and welcome to <code>dusk bot</code> a bot for buying and selling solana/eth/base tokens along with some extra things like pumpfun integration! The bot has the ability to share data between this version and the discord based version, do you have a discord account?", {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{text: "Yes!", callback_data: "create_with_discord"}, {text: "No!", callback_data: "create_without_discord"}]
            ]
        }
    })
    
})

bot.on("message", async (ctx) => {
    await triageMessage(ctx)
})
bot.on("callback_query", async (ctx) => {
    console.log(ctx)
    await triageButtons(ctx)
    // let token = ctx.update.callback_query.data.split("_")[1]
    // await ctx.reply("Token : " + token)
})
bot.launch()
process.once("SIGINT", () => bot.stop("SIGING"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))