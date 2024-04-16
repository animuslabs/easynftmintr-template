## EASYNFTMINTR UI
This UI connects to an instance of the easynftmintr contract and makes it easy for users to mint NFTs and view the inventory of NFTS they hold in their account.

## Getting Started

### Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
# or
npm run dev
# or
yarn dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```

### Check for typescript errors
```bash
yarn tsc
# or
npm run tsc
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).


# to change network

anchor.ts --> const client = new APIClient({ url: endpoints[1][1] })

atomic.ts --> const client = new APIClient({ url: endpoints[1][1] })
and collection/contract names change

config.ts --> change networks

quasar.config.js --> update build.env with your specific contract and collection names

