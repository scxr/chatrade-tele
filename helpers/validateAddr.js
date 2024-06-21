function isValidSolanaAddress(address) {
    const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    
    // Check if the address is exactly 44 characters
    if (address.length !== 44) {
        return false;
    }

    // Check each character to ensure it is in the Base58 character set
    for (let i = 0; i < address.length; i++) {
        if (!base58Chars.includes(address[i])) {
            return false;
        }
    }

    return true;
}

module.exports = isValidSolanaAddress