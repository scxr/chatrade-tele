const redis = require("redis")

const mainClient = redis.createClient({
    socket: {
        host: "localhost",
        port: 6379
    }
})

const linkClient = redis.createClient({
    socket: {
        host: "localhost",
        port: 4444
    }
})

const linkClientListen = redis.createClient({
    socket: {
        host: "localhost",
        port: 4444
    }
})

module.exports = {linkClient, linkClientListen, mainClient}