const fs = require("fs");
const path = require("path");

const contracts = ["DaiToken", "DappToken", "TokenFarm"];

const artifactsPath = path.resolve(__dirname, "../artifacts/contracts");
const destinationPath = path.resolve(__dirname, "../src/abis");

if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
}

contracts.forEach((name) => {
  const source = path.join(artifactsPath, `${name}.sol`, `${name}.json`);
  const destination = path.join(destinationPath, `${name}.json`);
  fs.copyFileSync(source, destination);
  console.log(`✔ Copied ${name}.json to frontend`);
});
