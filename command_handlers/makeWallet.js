const ethers = require("ethers")
const {Keypair} = require("@solana/web3.js")
const bs58 = require("bs58")
async function makeWallet(ctx) {

    let solanaWallet = Keypair.generate()
    let solPubKey = solanaWallet.publicKey.toBase58()
    let solPrivKey =bs58.encode(solanaWallet.secretKey)

    let text = `**Your wallet**\n\nAddress: \`\`\`${solPubKey}\`\`\`\n\nSecret: ||${solPrivKey}||`
    await ctx.replyWithMarkdownV2(text)
}

module.exports = makeWallet