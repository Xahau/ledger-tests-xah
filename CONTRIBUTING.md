# Ledger XAH App Contributing

### Run Standalone

`xrpld-netgen up:standalone --network_id=21338`

## Building XAH Ledger App

Resources:

- https://github.com/LedgerHQ/app-boilerplate
- https://developers.ledger.com/docs/embedded-app/build-load/

Clone App-XAH:
```sh
git clone git@github.com:Transia-RnD/app-xah.git
```

Install Ledger VS-Code extension.

Update settings for app-xah and nanox

## Clone Speculos & Build Speculos

Clone Speculos:
```sh
git clone git@github.com:LedgerHQ/speculos.git
```

Build docker on M1 (from root):
```sh
docker build -t speculos-builder:latest -f build.Dockerfile .
```

Edit Dockerfile and replace the first line with:

```sh
FROM speculos-builder:latest AS builder
```
then
```sh
docker build -t speculos:latest .
```

## Run App-XAH with Speculos

Build the App-XAH using the Ledger VS Code extension & copy the bin/app.elf into the speculos/apps directory

Run speculos with
```sh
docker run --rm -it -v $(pwd)/apps:/speculos/apps --publish 40000:40000 --publish 41000:41000 --publish 5001:5001 speculos --display headless --vnc-port 41000 --api-port 5001 --apdu-port 40000 --model nanox --seed "ssbTMHrmEJP7QEQjWJH3a72LQipBM" apps/app.elf
```

Then open the browser: http://127.0.0.1:5000 or http://127.0.0.1:5001

### Generating the Test Cases

> Remeber to update the ripple-binary-codec st-object.js file to remove the sorting.

```before
let sorted = Object.keys(xAddressDecoded)
    .map((f) => definitions.field[f])
    .filter((f) => f !== undefined &&
    xAddressDecoded[f.name] !== undefined &&
    f.isSerialized)
    .sort((a, b) => {
    return a.ordinal - b.ordinal;
});
```

```
let sorted = Object.keys(xAddressDecoded)
    .map((f) => definitions.field[f])
    .filter((f) => f !== undefined &&
    xAddressDecoded[f.name] !== undefined &&
    f.isSerialized);
```