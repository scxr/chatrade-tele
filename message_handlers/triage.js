// const { parse } = require("dotenv")
const { getPairByName, getPairByAddr } = require("../helpers/getTokenInfo")
const getUserDetails = require("../helpers/getUserDetails")
const { buyToken } = require("../helpers/tradeSol")
const isValidSolanaAddress = require("../helpers/validateAddr")
const lookUpToken = require("./handle_funcs/tokenLookUp")

async function triageMessage(ctx) {
    let text = ctx.update.message.text
    if (isValidSolanaAddress(text) || text.startsWith("$")) {
        
        let reply =  await ctx.reply("Looking up your token...")
        console.log(reply)
        let messageId = reply.message_id
        await lookUpToken(text, ctx, reply)
        // console.log(tokenInfo)
    } else if (ctx.session.step == "askSlippage") {
        ctx.session.slippage = ctx.update.message.text
        ctx.session.step = "askValue"
        await ctx.reply("How much do you want to buy?")
    } else if (ctx.session.step == "askValue") {
        ctx.session.value = ctx.update.message.text
        ctx.session.step = null
        let reply = await ctx.reply("💲 Buying your token...")
        let [_, result] = await buyToken(ctx.session.token, ctx.session.value, ctx.session.slippage, ctx.update.message.from.id)
        await ctx.editMessageText(`💲Your buy has been sent!\nSee how it's going here: <a href="https://explorer.jito.wtf/bundle/${result}">Explorer</a>`, {
            chat_id: reply.chat.id,
            message_id: reply.message_id,
            parse_mode: "HTML",
            disable_web_page_preview: true
        })
        // await ctx.reply(`Buying ${ctx.session.token} with slippage ${ctx.session.slippage}% and value ${ctx.session.value}`)
    } else if(text == "!testing") {
        console.log(ctx)
        await getUserDetails(ctx.update.message.from.id )
    } else {
        await ctx.reply("Invalid solana address")
    }

}

module.exports = triageMessage