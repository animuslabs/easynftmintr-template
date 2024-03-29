module.exports = {
    networks:{
        jungle: {
            node_url: 'https://jungle4.cryptolions.io:443',
            chain: 'jungle',
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
