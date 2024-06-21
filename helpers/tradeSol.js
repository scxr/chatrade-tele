const axios = require("axios")
const getUserDetails = require("./getUserDetails")

async function buyToken(token, amount, slippage, uid) {
    console.log("buyToken", token, amount, slippage, uid)
    let user = await getUserDetails(uid)
    // let userConfig = JSON.parse(user)/
    let userPriv = user.solPriv
    console.log(`http://localhost:3000/buy/buy/${token}/${amount * 10 ** 9}/${userPriv}`)
    let resp = await axios.post(`http://localhost:3000/buy/buy/${token}/${amount}/${userPriv}`)
    return [true, resp.data.result]
}

module.exports = {buyToken}