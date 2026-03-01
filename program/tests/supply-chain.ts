import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SupplyChain } from "../target/types/supply_chain";
import { expect } from "chai";

describe("supply-chain", () => {
    // Configure the client to use the devnet cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Load program directly from workspace — picks up the correct program ID from the IDL
    const program = anchor.workspace.SupplyChain as Program<SupplyChain>;

    const owner = provider.wallet;
    const productName = "Batch #123";
    let productPda: anchor.web3.PublicKey;

    before(async () => {
        [productPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("product"),
                owner.publicKey.toBuffer(),
                Buffer.from(productName),
            ],
            program.programId
        );
    });

    it("Registers a product", async () => {
        const thresholds = {
            maxTemp: 800, // 8.00 C
            minTemp: 200, // 2.00 C
            maxHumidity: 8000, // 80%
            minHumidity: 4000, // 40%
        };

        await program.methods
            .registerProduct(productName, thresholds)
            .accounts({
                product: productPda,
                owner: owner.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const productAccount = await program.account.product.fetch(productPda);
        expect(productAccount.name).to.equal(productName);
        expect(productAccount.owner.toBase58()).to.equal(owner.publicKey.toBase58());
        expect(productAccount.alertActive).to.be.false;
        expect(productAccount.thresholds.maxTemp).to.equal(800);
    });

    it("Reports a valid reading", async () => {
        // 5.00 C, 60% humidity -> within thresholds
        await program.methods
            .reportReading(0, 0, 500, 6000)
            .accounts({
                product: productPda,
                authority: owner.publicKey,
            })
            .rpc();

        const productAccount = await program.account.product.fetch(productPda);
        expect(productAccount.latestReading.temperature).to.equal(500);
        expect(productAccount.alertActive).to.be.false;
        expect(productAccount.readingHistory.length).to.equal(1);
    });

    it("Reports an invalid reading that triggers an alert", async () => {
        // 10.00 C -> Above maxTemp
        await program.methods
            .reportReading(100, 100, 1000, 6000)
            .accounts({
                product: productPda,
                authority: owner.publicKey,
            })
            .rpc();

        const productAccount = await program.account.product.fetch(productPda);
        expect(productAccount.latestReading.temperature).to.equal(1000);
        expect(productAccount.alertActive).to.be.true;
        expect(productAccount.readingHistory.length).to.equal(2);
    });

    it("Updates thresholds", async () => {
        const newThresholds = {
            maxTemp: 1200, // 12.00 C
            minTemp: 200,
            maxHumidity: 8000,
            minHumidity: 4000,
        };

        await program.methods
            .setThresholds(newThresholds)
            .accounts({
                product: productPda,
                owner: owner.publicKey,
            })
            .rpc();

        const productAccount = await program.account.product.fetch(productPda);
        // Since latest temp was 10.00 C and new max is 12.00 C, alert should be cleared
        expect(productAccount.thresholds.maxTemp).to.equal(1200);
        expect(productAccount.alertActive).to.be.false;
    });
});
