const { getDexInfo, checkSolSecurity } = require("../../helpers/getTokenInfo")

async function lookUpToken(text, ctx, reply) {
    let data, socialsInfo = ""
    data = await getDexInfo(text)
    // console.log(info)

    let solSecurity = await checkSolSecurity(data.tokenAddr)
    if (data.data.socials) {
        if (data.data.socials.length > 0) {
            for (let i of data.data.socials) {
                socialsInfo += `<a href="${i["url"]}">${i["type"]}</a> | `
                // socialsInfo += `[${i["type"]}](${i["url"]}) | `
            }
        } else {
            socialsInfo = "`N/A`"
        }

    } else {
        socialsInfo = "`N/A`"
    }
    // tokenBalance = `\`${tokenBalance == undefined ? "???": tokenBalance} ${token.tokenSymbol}\``
    let desc = `
    <b>🚀 <a href="https://solscan.io/token/${data.tokenAddr}">${data.tokenName} (${data.pairBase})</a></b>

⏰ <b>Created:</b> <code><i>${data.createdAt}</i></code>
⚡ <b>Supply:</b> <code>${solSecurity.supply}</code>
💰 <b>Price:</b> <code>$${data.price}</code> | <b>MC:</b> <code>$${data.fdv}</code> | <b>Liq:</b> <code>$${data.liquidity}</code>

🏴 <b>Flags:</b> ${solSecurity.warnings.join("\n")}
👤 <b>Rugged:</b> <code>${solSecurity.rugged}</code>
🧾 <b>Transfer fee:</b> <code>${solSecurity.transfee}%</code>
⚙️ <b>Largest Holder:</b> <code>${solSecurity.topHolderPct}%</code>

🔄 <b>Pair:</b> <a href="https://dexspy.io/sol/token/${data.pairAddr}">Here</a>
🌐 <b>Socials:</b> ${socialsInfo}
📊 <b>Recent Activity:</b>
- 5M Volume: <code>$${data.volume5m}</code>
- 1H Volume: <code>$${data.volume1h}</code>
- 6H Volume: <code>$${data.volume6h}</code>

    `
    // console.log
    await ctx.editMessageText(desc, {
        chat_id: reply.chat.id,
        message_id: reply.message_id,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
            inline_keyboard: [
                [{text: "Buy", callback_data: `buy_${data.tokenAddr}`}]
            ]
        }
    })
    // await ctx.editMessageText(reply.chat.id, reply.message_id, undefined, desc, parse_mode = "HTML")

}

module.exports = lookUpToken