const axios = require("axios")
const {
    HttpsProxyAgent
} = require("https-proxy-agent")
const proxyAgent = new HttpsProxyAgent("https://sp5zv6yvm8:n~mbzggGQ615duMlP8@gate.smartproxy.com:10001")
function formatNumber(num) {
    if (num == undefined) {
        return "N/A"
    }
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return num.toString();
    }
}

function timeSince(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    console.log("Seconds since: ", seconds)
    let interval = seconds / 31536000; // Number of seconds in a year

    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000; // Number of seconds in a month
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400; // Number of seconds in a day
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600; // Number of seconds in an hour
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60; // Number of seconds in a minute
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}
async function getPairByAddr(tokenAddr) {
    let url = `https://api.dexscreener.io/latest/dex/tokens/${tokenAddr}`
    console.log("API URL: ", url)
    let resp = await axios.get(url)
    console.log(resp.data)
    if (resp.data.pairs == null) {
        console.log("returning null", resp.data)
        return null
    }
    return resp.data.pairs[0]

}

async function getPairByName(tokenName) {
    let url = `https://api.dexscreener.io/latest/dex/search?q=${tokenName}`
    console.log("API URL: ", url)

    let resp = await axios.get(url)
    // fs.writeFileSync("response.json", JSON.stringify(resp.data))
    if (!resp.data.pairs[0]) {
        console.log("returning null", resp.data)
        return null
    }
    // console.log(resp.data.pairs)

    let toret
    let currret = -1000000000
    for (let i of resp.data.pairs) {
        if (i.fdv > currret) {
            toret = i
            currret = i.fdv
        }

    }
    console.log(toret)
    return resp.data.pairs[0]
}

async function checkSolSecurity(tokenAddr) {
    let url = `https://api.rugcheck.xyz/v1/tokens/${tokenAddr}/report`

    let resp = await axios.get(url)

    console.log(resp.data)
    let isFreezable = resp.data.token.freezeAuthority == null
    let isMintable = resp.data.token.mintAuthority == null
    let warnings = []
    if (resp.data.risks.length > 0) {
        for (let i of resp.data.risks) {
            console.log(i)
            warnings.push(i.level == "warn" ? "🟠": "🔴 " + i.name)
            console.log(i.level == "warn" ? "🟠": "🔴 "  + i.name)
        }
    }
    let rugged = resp.data.rugged
    let transfee = resp.data.transferFee.pct
    let topHolderPct = parseFloat(resp.data.topHolders[0].pct).toFixed(2)
    let supply = resp.data.token.supply / 10 ** resp.data.token.decimals
    return {
        isFreezable: isFreezable,
        isMintable: isMintable,
        warnings: warnings,
        rugged: rugged,
        transfee: transfee,
        topHolderPct: topHolderPct,
        supply: supply
    }
}
async function getDexInfo(inp) {
    let info
    if (!inp.startsWith("$")) {
        info = await getPairByAddr(inp)
        if (info == null) {
            return null
        }
        inp = info.tokenAddr
    } else {
        info = await getPairByName(inp)
    }
    console.log(info)
    let chain = info.chainId
    let url = info.url
    let pairAddr = info.pairAddress
    let pairBase = info.baseToken.symbol
    let pairBaseAddr = info.baseToken.address
    let pairBaseName = info.baseToken.name
    let pairQuote = info.quoteToken.symbol
    let priceUsd = info.priceUsd
    let {
        m5: {
            buys: min5buys,
            sells: min5sells
        }
    } = info.txns;
    let {
        h1: {
            buys: hour1buys,
            sells: hour1sells
        }
    } = info.txns;
    let {
        h6: {
            buys: hour6buys,
            sells: hour6sells
        }
    } = info.txns;
    let {
        h24: {
            buys: hour24buys,
            sells: hour24sells
        }
    } = info.txns;
    let m5txs = min5buys + min5sells
    let h1txs = hour1buys + hour1sells
    let h6txs = hour6buys + hour6sells
    let h24txs = hour24buys + hour24sells
    let volume5m = info.volume.m5
    let volume1h = info.volume.h1
    let volume6h = info.volume.h6
    let volume24h = info.volume.h24
    let priceChange5m = info.priceChange["m5"]
    let priceChange1h = info.priceChange["h1"]
    let priceChange6h = info.priceChange["h6"]
    let liquidity = info.liquidity.usd
    let fdv = info.fdv
    let date = info.pairCreatedAt 
    let createdAt = timeSince(date)

    

    // Will display time in 10:30:23 format
    let data = info.info
    if (!data) {
        data = {}
    }
    if (!Object.keys(data).includes("socials")) {
        data.socials = []
    }
    let toreturn = {
        price: priceUsd,
        chain: chain,
        url: url,
        pairAddr: pairAddr,
        pairBase: pairBase,
        pairQuote: pairQuote,
        priceUsd: priceUsd,
        min5buys: min5buys,
        min5sells: min5sells,
        hour1buys: hour1buys,
        hour1sells: hour1sells,
        hour6buys: hour6buys,
        hour6sells: hour6sells,
        hour24buys: hour24buys,
        hour24sells: hour24sells,
        m5txs: m5txs,
        h1txs: h1txs,
        h6txs: h6txs,
        h24txs: h24txs,
        volume5m: formatNumber(volume5m),
        volume1h: formatNumber(volume1h),
        volume6h: formatNumber(volume6h),
        volume24h: volume24h,
        priceChange5m: priceChange5m,
        priceChange1h: priceChange1h,
        priceChange6h: priceChange6h,
        liquidity: formatNumber(liquidity, 0, true),
        fdv: formatNumber(fdv, 0, true),
        createdAt: createdAt,
        data: data,
        tokenAddr: pairBaseAddr,
        tokenName: pairBaseName
    }
    console.log(toreturn)
    // console.log(chain, url, pairAddr, pairBase, pairQuote, priceUsd, min5buys, min5sells, hour1buys, hour1sells, hour6buys, hour6sells, hour24buys, hour24sells, volume1h, volume6h, volume24h, priceChange5m, priceChange1h, priceChange6h, liquidity, fdv, createdAt, data)
    // console.log(info)
    return toreturn
}
module.exports = {
    checkSolSecurity, 
    getPairByName,
    getPairByAddr,
    getDexInfo
}