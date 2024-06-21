const {linkClient, mainClient} = require("../constants/redis_shit")

async function getUserDetails(user) {
    let hasUserLinked = await linkClient.get(`${user}`)
    console.log(hasUserLinked)
    if (hasUserLinked) {

        let userInfo = await mainClient.get(`${hasUserLinked}`)
        let realUserInfo = JSON.parse(userInfo)
        console.log(realUserInfo)
        return realUserInfo
    }
}


// console.log(JSON.stringify(a))
module.exports = getUserDetails