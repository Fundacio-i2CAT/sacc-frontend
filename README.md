# Blockchain-HDA

## Prerequisites
* [Git](https://git-scm.com/)
* [nvm](https://github.com/nvm-sh/nvm)
* [Node](https://nodejs.org/en/) > 10.x
* [npm](https://www.npmjs.com/) > 6.x or yarn > 15.x
* [Google Chrome](https://www.google.com/chrome/) > 75.x
* [Metamask](https://metamask.io/) (Chrome Plugin).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you want to know more 
on this framework, the code style guide of further documentation, please refer to [docs/react.md](docs/react.md).

## Configuration
Please, inspect files .env.development.sample and .env.production.sample in order
to adapt them to your needs; after that copy them to .env.development and .env.production
and edit with your own configuration values.

## npm scripts
You can find a list of the available scripts as described in the `package.json` file in 
[docs/npm-scripts.md](docs/npm-scripts.md).

## configure Metamask
Metamask is a browser extension available in Chrome based browsers, Firefox and Opera, that allows us to perform certain 
ethereum specific operations such as running dApps, identity management and much more.  

You can find detailed instructions on how to run and configure it for the specific uses of this dApp in 
[docs/metamask-setup.md](docs/metamask-setup.md).

## configure development environment
Install dependencies with `npm ci` or `yarn install`.

Copy the sample environments and make sure they contain the correct data, as for now, no further modifications are required on the content of these files.
```
$ cp .env.development.sample .env.development
$ cp .env.production.sample .env.production
```

## start development environment
To start development environment on `http://localhost:3000`, simply run `npm start`.
