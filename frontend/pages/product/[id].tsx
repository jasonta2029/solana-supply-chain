import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Shield,
    Thermometer,
    Droplets,
    MapPin,
    Clock,
    Activity,
    CheckCircle2,
    AlertTriangle,
    QrCode
} from 'lucide-react';

import { QRCodeComponent } from '../../components/QRCodeComponent';
import { TemperatureChart } from '../../components/TemperatureChart';
import { SectionLabel } from '../../components/SectionLabel';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import * as anchor from '@coral-xyz/anchor';
import idl from '../../idl/supply_chain.json';

const MapComponent = dynamic(() => import('../../components/Map'), { ssr: false });

const getProgram = (connection: any, wallet: any) => {
    const provider = new anchor.AnchorProvider(connection, wallet || {}, {
        preflightCommitment: 'confirmed',
    });
    return new anchor.Program(idl as any, provider);
};

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { connection } = useConnection();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        let interval: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const program = getProgram(connection, null);
                const productPda = new PublicKey(id as string);
                const account = await program.account.product.fetch(productPda);

                const history = account.readingHistory.map((r: any) => ({
                    timestamp: new Date(r.timestamp.toNumber() * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    temperature: r.temperature / 100,
                    humidity: r.humidity / 100,
                    lat: r.latitude / 10000000,
                    lon: r.longitude / 10000000
                }));

                setProduct({
                    name: account.name,
                    owner: account.owner.toBase58(),
                    alertActive: account.alertActive,
                    thresholds: account.thresholds,
                    latestReading: account.latestReading,
                    readingHistory: history
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();
        interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);

    }, [id, connection]);

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6"
            >
                <Activity className="text-accent w-8 h-8" />
            </motion.div>
            <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">Synchronizing with Cluster...</p>
        </div>
    );

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="min-h-screen bg-background">
            {/* Nav */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-semibold">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Connected: Devnet</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-0 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                        <div className="flex-1">
                            <SectionLabel label="Live Telemetry" />
                            <h1 className="text-5xl md:text-6xl mb-4 font-display leading-tight">{product.name}</h1>
                            <div className="flex flex-wrap items-center gap-4">
                                <p className="text-sm font-mono text-muted-foreground bg-muted px-3 py-1 rounded-lg border border-border">
                                    PDA: {id}
                                </p>
                                {product.alertActive ? (
                                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20">
                                        <AlertTriangle className="w-4 h-4 animate-pulse" />
                                        Threshold Violated
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 bg-green-500/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/20">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Optimal Conditions
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Card hover={false} className="p-4 flex items-center gap-4 bg-white/50 border-dashed">
                                <QRCodeComponent url={currentUrl} />
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1">Mobile Access</p>
                                    <p className="text-xs text-muted-foreground leading-tight">Scan to view <br />public audit trail</p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <Card className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                    <Thermometer className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Temperature</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-5xl font-sans font-bold tracking-tighter ${product.alertActive ? 'text-red-500' : 'text-foreground'}`}>
                                    {(product.latestReading.temperature / 100).toFixed(1)}
                                </span>
                                <span className="text-2xl font-sans font-bold text-muted-foreground">°C</span>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <span>LIMITS</span>
                                <span>{(product.thresholds.minTemp / 100)}° - {(product.thresholds.maxTemp / 100)}°</span>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-accent-secondary/10 rounded-xl flex items-center justify-center text-accent-secondary">
                                    <Droplets className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Humidity</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-sans font-bold tracking-tighter">
                                    {(product.latestReading.humidity / 100).toFixed(1)}
                                </span>
                                <span className="text-2xl font-sans font-bold text-muted-foreground">%</span>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <span>LIMITS</span>
                                <span>{(product.thresholds.minHumidity / 100)}% - {(product.thresholds.maxHumidity / 100)}%</span>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center text-foreground">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Coordinates</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-sans font-bold">{(product.latestReading.latitude / 10000000).toFixed(4)} N</p>
                                <p className="text-xl font-sans font-bold">{(product.latestReading.longitude / 10000000).toFixed(4)} W</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <span>LAST UPDATE</span>
                                <span>JUST NOW</span>
                            </div>
                        </Card>
                    </div>

                    {/* Map & Chart Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
                        <Card className="aspect-video lg:aspect-auto h-[500px] border-none shadow-none">
                            <MapComponent
                                lat={product.latestReading.latitude / 10000000}
                                lon={product.latestReading.longitude / 10000000}
                                label="Current Position"
                            />
                        </Card>

                        <Card className="p-10 flex flex-col">
                            <h3 className="text-2xl font-display mb-8">Fluctuation History</h3>
                            <div className="flex-1 min-h-[300px]">
                                <TemperatureChart
                                    data={product.readingHistory}
                                    maxTemp={product.thresholds.maxTemp / 100}
                                    minTemp={product.thresholds.minTemp / 100}
                                />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Inverted Contrast Audit Trail Section */}
                <section className="bg-foreground text-background py-32 relative overflow-hidden">
                    <div className="absolute inset-0 dot-pattern-light opacity-5" />
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                            <div>
                                <SectionLabel label="Verification" />
                                <h2 className="text-4xl md:text-5xl font-display text-white">Immutable Audit Trail</h2>
                            </div>
                            <p className="text-white/40 font-mono text-sm max-w-sm">Every reading is signed by the hardware enclave and hashed onto the Solana ledger.</p>
                        </div>

                        <div className="space-y-6">
                            {product.readingHistory.slice().reverse().map((reading: any, idx: number) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={idx}
                                    className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-4 min-w-[120px]">
                                        <Clock className="w-4 h-4 text-accent-secondary" />
                                        <span className="text-sm font-mono text-white/60">{reading.timestamp}</span>
                                    </div>

                                    <div className="flex-1 flex flex-wrap gap-8">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Temp</span>
                                            <span className="text-lg font-bold text-white">{reading.temperature.toFixed(1)}°C</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Humid</span>
                                            <span className="text-lg font-bold text-white/80">{reading.humidity.toFixed(0)}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 hidden lg:flex">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Position</span>
                                            <span className="text-sm font-mono text-white/40">{reading.lat.toFixed(4)}, {reading.lon.toFixed(4)}</span>
                                        </div>
                                    </div>

                                    <div className="hidden md:block">
                                        <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
