# XAH Wallet App Test Suite

Test utility for testing functionality of [ledger-app-xah](https://github.com/LedgerHQ/ledger-app-xah) targeting Ledger Nano S and Ledger Nano X.

## Usage

### Installation
Install the package dependencies by running:
```sh
yarn install
```

### Run all tests
In order to run the entire test suite, simply plug in your Ledger Nano S or Ledger Nano X and run:
```sh
yarn run test:integration
```

### Run a subset of the test suite
The available tests can be filtered based on the arguments you pass when starting the test suite.

You can choose to supply a list of filters by running the test suite as follows:
```sh
yarn run test:integration test/integration/invoke.test.ts
```