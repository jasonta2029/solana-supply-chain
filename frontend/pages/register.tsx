import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Thermometer, Droplets, Loader2, CheckCircle2 } from 'lucide-react';

import { SectionLabel } from '../components/SectionLabel';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
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
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
            return;
        }

        setLoading(true);
        try {
            const provider = new anchor.AnchorProvider(connection, wallet as any, {
                preflightCommitment: 'confirmed',
            });
            const program = new anchor.Program(idl as any, provider);

            const [productPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("product"),
                    wallet.publicKey.toBuffer(),
                    Buffer.from(name)
                ],
                program.programId
            );

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

            setSuccess(true);
            setTimeout(() => {
                router.push(`/product/${productPda.toBase58()}`);
            }, 2000);
        } catch (error) {
            console.error(error);
            alert("Registration failed. Ensure the name is unique.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-semibold">Back to Dashboard</span>
                    </Link>
                    <WalletMultiButton className="!bg-foreground !text-background !rounded-xl !h-11 !px-6 !text-sm !font-semibold hover:!opacity-90 transition-all shadow-lg" />
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <SectionLabel label="Account Provisioning" />
                        <h1 className="text-4xl md:text-5xl font-display mt-2 mb-4">Register New Batch</h1>
                        <p className="text-muted-foreground">Define safety thresholds and initialize the on-chain PDA.</p>
                    </div>

                    <Card className="p-10 shadow-2xl relative overflow-hidden">
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-10"
                                >
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                                        <CheckCircle2 className="text-white w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-display mb-2">Registration Successful</h2>
                                    <p className="text-muted-foreground">Provisioning on-chain architecture... Redirecting in a moment.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleRegister} className="space-y-10">
                            {/* Product Name */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Identification</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-muted/30 border border-border rounded-xl h-14 px-6 text-foreground font-semibold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Organic Produce Batch #A402"
                                        required
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/20">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Threshold Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Temperature */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-accent">
                                        <Thermometer className="w-4 h-4" />
                                        <span className="text-xs font-mono uppercase tracking-widest font-bold">Temperature (°C)</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Max Limit</label>
                                            <input type="number" step="0.1" value={maxTemp} onChange={e => setMaxTemp(e.target.value)} className="w-full bg-muted/20 border border-border rounded-lg h-11 px-4 text-sm focus:ring-1 focus:ring-accent outline-none" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Min Limit</label>
                                            <input type="number" step="0.1" value={minTemp} onChange={e => setMinTemp(e.target.value)} className="w-full bg-muted/20 border border-border rounded-lg h-11 px-4 text-sm focus:ring-1 focus:ring-accent outline-none" required />
                                        </div>
                                    </div>
                                </div>

                                {/* Humidity */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-accent-secondary">
                                        <Droplets className="w-4 h-4" />
                                        <span className="text-xs font-mono uppercase tracking-widest font-bold">Humidity (%)</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Max Limit</label>
                                            <input type="number" step="0.1" value={maxHum} onChange={e => setMaxHum(e.target.value)} className="w-full bg-muted/20 border border-border rounded-lg h-11 px-4 text-sm focus:ring-1 focus:ring-accent-secondary outline-none" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Min Limit</label>
                                            <input type="number" step="0.1" value={minHum} onChange={e => setMinHum(e.target.value)} className="w-full bg-muted/20 border border-border rounded-lg h-11 px-4 text-sm focus:ring-1 focus:ring-accent-secondary outline-none" required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={!wallet.publicKey || loading}
                                className="w-full h-16 text-lg flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Securing Channel...
                                    </>
                                ) : (
                                    <>
                                        {wallet.publicKey ? 'Commit to Blockchain' : 'Connect Wallet to Commit'}
                                        <CheckCircle2 className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    );
}
