/**
 * Syncs the program ID from target/deploy/supply_chain-keypair.json
 * into programs/supply-chain/src/lib.rs and Anchor.toml.
 * Run this before "anchor build" and "anchor test" if you get DeclaredProgramIdMismatch.
 */
const fs = require("fs");
const path = require("path");

const programDir = path.join(__dirname, "..");
const keypairPath = path.join(programDir, "target", "deploy", "supply_chain-keypair.json");
const libPath = path.join(programDir, "programs", "supply-chain", "src", "lib.rs");
const anchorPath = path.join(programDir, "Anchor.toml");

if (!fs.existsSync(keypairPath)) {
  console.error("Keypair not found. Run 'anchor build' first to generate it.");
  process.exit(1);
}

const keypair = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
const { Keypair } = require("@solana/web3.js");
const programId = Keypair.fromSecretKey(Uint8Array.from(keypair)).publicKey.toBase58();

console.log("Program ID from keypair:", programId);

// Update lib.rs
let lib = fs.readFileSync(libPath, "utf-8");
lib = lib.replace(/declare_id!\s*\(\s*"[^"]+"\s*\)/, `declare_id!("${programId}")`);
fs.writeFileSync(libPath, lib);
console.log("Updated programs/supply-chain/src/lib.rs");

// Update Anchor.toml
let anchor = fs.readFileSync(anchorPath, "utf-8");
const idRegex = /(supply_chain\s*=\s*)"[^"]+"/g;
anchor = anchor.replace(idRegex, `$1"${programId}"`);
fs.writeFileSync(anchorPath, anchor);
console.log("Updated Anchor.toml");

console.log("Done. Run 'anchor build' then 'anchor test'.");
