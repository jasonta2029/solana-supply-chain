import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionLabel } from '../components/SectionLabel';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ArrowRight, Package, Shield, Zap } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
                            <Shield className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold font-sans tracking-tight">Trace<span className="text-accent">Chain</span></span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/register" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                            Documentation
                        </Link>
                        <WalletMultiButton className="!bg-foreground !text-background !rounded-xl !h-11 !px-6 !text-sm !font-semibold hover:!opacity-90 transition-all shadow-lg" />
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto mb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <SectionLabel label="Next-Gen Supply Chain" />
                            <h1 className="text-5xl md:text-7xl mb-8 leading-[1.05] tracking-tight">
                                Immutable Trust. <br />
                                <span className="gradient-text">Real-Time</span> Precision.
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                                Track high-value assets with millisecond latency on Solana.
                                Secure, decentralized, and visually transparent supply chain monitoring for the modern world.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register">
                                    <Button className="w-full sm:w-auto flex items-center gap-2 group">
                                        Register Shipment
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    View Live Cluster
                                </Button>
                            </div>
                        </motion.div>

                        {/* Abstract Hero Graphic */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative aspect-square max-w-[500px] ml-auto">
                                {/* Rotating Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-dashed border-accent/20 rounded-full"
                                />

                                {/* Floating Cards */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-1/4 -left-10 z-10"
                                >
                                    <Card hover={false} className="p-5 shadow-accent-lg border-accent/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                                <Zap className="w-5 h-5 fill-accent" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Status</p>
                                                <p className="font-bold text-accent">Real-Time</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute bottom-1/4 -right-5 z-20"
                                >
                                    <Card hover={false} className="p-5 shadow-2xl border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center text-background">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Assets</p>
                                                <p className="font-bold">Encrypted</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Central Glow */}
                                <div className="absolute inset-0 bg-accent/5 rounded-full blur-[100px]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent shadow-[0_0_100px_rgba(0,82,255,0.4)] rounded-full flex items-center justify-center">
                                    <Shield className="text-white w-12 h-12" />
                                </div>

                                {/* Background Dots Texture */}
                                <div className="absolute inset-0 dot-pattern opacity-10" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Dashboard Section */}
                <section className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <SectionLabel label="Live Dashboard" />
                            <h2 className="text-4xl">On-Chain Shipments</h2>
                        </div>
                        <div className="hidden md:block text-right">
                            <p className="text-sm text-muted-foreground font-mono">NETWORK: DEVNET</p>
                            <p className="text-xs text-accent uppercase font-bold tracking-widest">Active nodes emitting data</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Placeholder/Empty State */}
                        <div className="col-span-full">
                            <Card featured className="p-16 text-center border-dashed">
                                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Package className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">No Active Shipments</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-10">
                                    Begin your journey by registering a new product batch. Each batch receives a unique on-chain ID and real-time PDA.
                                </p>
                                <Link href="/register">
                                    <Button className="px-10">Register Your First Product</Button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer texture block */}
            <div className="h-44 bg-foreground relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 dot-pattern-light" />
                <p className="relative text-white/20 font-mono text-[10rem] font-black select-none tracking-tighter">SOLANA</p>
            </div>
        </div>
    );
}
