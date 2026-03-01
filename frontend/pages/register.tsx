import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { useRouter } from 'next/router';
import Link from 'next/link';

import idl from '../idl/supply_chain.json';

const PROGRAM_ID = new PublicKey(idl.address || process.env.NEXT_PUBLIC_PROGRAM_ID || '8WDANFoeFAZE2VSdtLfnNfjawRXc6ftMpbfeQU6DpEdu');

export default function Register() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const router = useRouter();

    const [name, setName] = useState('');
    const [maxTemp, setMaxTemp] = useState('');
    const [minTemp, setMinTemp] = useState('');
    const [maxHum, setMaxHum] = useState('');
    const [minHum, setMinHum] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
            return alert("Please connect your wallet first!");
        }

        setLoading(true);
        try {
            // Set up anchor provider
            const provider = new anchor.AnchorProvider(connection, wallet as any, {
                preflightCommitment: 'confirmed',
            });
            const program = new anchor.Program(idl as any, provider);

            // Find PDA
            const [productPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("product"),
                    wallet.publicKey.toBuffer(),
                    Buffer.from(name)
                ],
                program.programId
            );

            // Fixed point: multiply by 100
            const thresholds = {
                maxTemp: Math.round(parseFloat(maxTemp) * 100),
                minTemp: Math.round(parseFloat(minTemp) * 100),
                maxHumidity: Math.round(parseFloat(maxHum) * 100),
                minHumidity: Math.round(parseFloat(minHum) * 100),
            };

            await program.methods
                .registerProduct(name, thresholds)
                .accounts({
                    product: productPda,
                    owner: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            alert(`Product registered successfully! PDA: ${productPda.toBase58()}`);
            router.push(`/product/${productPda.toBase58()}`);
        } catch (error) {
            console.error(error);
            alert("Error registering product. Make sure the name is unique and you have enough devnet SOL.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-3xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <Link href="/" className="text-primary hover:underline font-medium flex items-center gap-2">
                    ← Back to Dashboard
                </Link>
                <WalletMultiButton className="!bg-surface" />
            </header>

            <div className="bg-surface p-8 rounded-xl border border-gray-800 shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-white">Register New Product</h1>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Product Name / Batch ID</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="e.g. Organic Strawberries Batch #123"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-[#0f1115] rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-primary mb-4">Temperature (°C)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                                    <input type="number" step="0.1" value={maxTemp} onChange={e => setMaxTemp(e.target.value)} className="w-full bg-surface p-2 rounded border border-gray-700 text-sm focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                                    <input type="number" step="0.1" value={minTemp} onChange={e => setMinTemp(e.target.value)} className="w-full bg-surface p-2 rounded border border-gray-700 text-sm focus:border-primary" required />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-[#0f1115] rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-secondary mb-4">Humidity (%)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                                    <input type="number" step="0.1" value={maxHum} onChange={e => setMaxHum(e.target.value)} className="w-full bg-surface p-2 rounded border border-gray-700 text-sm focus:border-secondary" required />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                                    <input type="number" step="0.1" value={minHum} onChange={e => setMinHum(e.target.value)} className="w-full bg-surface p-2 rounded border border-gray-700 text-sm focus:border-secondary" required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!wallet.publicKey || loading}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${!wallet.publicKey ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(20,241,149,0.3)]'
                            }`}
                    >
                        {loading ? 'Registering on-chain...' : (wallet.publicKey ? 'Register on Solana' : 'Connect Wallet to Register')}
                    </button>
                </form>
            </div>
        </div>
    );
}
