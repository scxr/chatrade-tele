const makeWallet = require("../command_handlers/makeWallet")
const fs = require("fs")
const {linkClient: redisclient} = require("../constants/redis_shit")
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

async function triageButtons(ctx) {
    console.log(ctx)
    
    let action = ctx.update.callback_query.data
    if (action.startsWith("buy")) {
        let token = ctx.update.callback_query.data.split("_")[1]
        console.log("Requesting action: " + action)
        ctx.session.token = token
        ctx.session.step = "askSlippage"
        await ctx.reply("What slippage?")
    } else if (action == "create_without_discord") {
        await makeWallet(ctx)
    } else if (action == "create_with_discord") {
        console.log(ctx.update.callback_query.from)
        let linkCode = makeid(16)
        let userInfo = {
            id: ctx.update.callback_query.from.id,
            username: ctx.update.callback_query.from.username
        }
        await redisclient.set(`${linkCode}`,JSON.stringify(userInfo))
        await ctx.reply(`Your link code is <code>${linkCode}</code> to use it message the discord bot <code>!link ${linkCode}</code> `, {
            parse_mode: "HTML"
        })
    }
     
}

module.exports = triageButtons