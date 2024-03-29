module.exports = {
    networks:{
        telosTest: {
            node_url: 'https://testnet.telos.net',
            chain: 'telosTest',
            accounts: [
                {
                    name: 'easynftmintr',
                    // permission: 'owner', // defaults to active
                    private_key: process.env.PRIVATE_KEY
                }
            ]
        }
    },
}
