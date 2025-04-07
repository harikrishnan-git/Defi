const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentPath = path.join(
    __dirname,
    "..",
    "ignition",
    "deployments",
    "chain-1337",
    "deployed_addresses.json"
  );

  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ deployed_addresses.json not found!");
    process.exit(1);
  }

  const addresses = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const config = {
    daiToken: addresses["LockModule#DaiToken"] || "",
    dappToken: addresses["LockModule#DappToken"] || "",
    tokenFarm: addresses["LockModule#TokenFarm"] || "",
  };

  const output = `export const config = ${JSON.stringify(config, null, 2)};\n`;

  const configPath = path.join(__dirname, "..", "src", "config.js");
  fs.writeFileSync(configPath, output);

  console.log("✅ config.js generated at frontend/src/config.js");
}

main().catch((err) => {
  console.error("❌ Error generating config:", err);
  process.exit(1);
});
