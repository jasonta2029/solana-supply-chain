import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { QRCodeComponent } from '../../components/QRCodeComponent';
import { TemperatureChart } from '../../components/TemperatureChart';
import * as anchor from '@coral-xyz/anchor';
import idl from '../../idl/supply_chain.json';

// Leaflet Map must be dynamically imported because it does not support SSR
const MapComponent = dynamic(() => import('../../components/Map'), { ssr: false });

// Fetch program from standard provider
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

                // Format historical data from BN/objects to UI-friendly format
                // In a real production app, we would process the account's readingHistory
                const history = account.readingHistory.map((r: any) => ({
                    timestamp: new Date(r.timestamp.toNumber() * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
                // Keep trying if we're just waiting for first transaction to land
            }
        };

        fetchData();
        interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);

    }, [id, connection]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Waiting for first IoT reading...</div>;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <Link href="/" className="text-gray-400 hover:text-white mb-4 inline-block">← Back to Dashboard</Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold font-sans text-white">{product.name}</h1>
                        {product.alertActive ? (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm animate-bounce shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                ALERT: THRESHOLD EXCEEDED
                            </span>
                        ) : (
                            <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full font-bold text-sm">
                                STATUS: OPTIMAL
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 font-mono text-sm mt-2">On-Chain ID: {id}</p>
                </div>

                <div className="hidden md:block">
                    <QRCodeComponent url={currentUrl} />
                    <p className="text-center text-xs text-gray-500 mt-2">Scan to track</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Map & Overview */}
                <div className="col-span-1 lg:col-span-2 space-y-8">
                    <div className="bg-surface p-1 rounded-xl shadow-xl border border-gray-800">
                        <MapComponent
                            lat={product.latestReading.latitude / 10000000}
                            lon={product.latestReading.longitude / 10000000}
                            label="Current Location"
                        />
                    </div>

                    <div className="bg-surface p-6 rounded-xl border border-gray-800 shadow-xl">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Live Telemetry
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#0f1115] p-4 rounded-lg border border-gray-800">
                                <p className="text-gray-500 text-sm mb-1">Temperature</p>
                                <p className={`text-3xl font-bold ${product.alertActive ? 'text-red-400' : 'text-primary'}`}>
                                    {(product.latestReading.temperature / 100).toFixed(2)} °C
                                </p>
                                <p className="text-xs text-gray-600 mt-2">Range: {(product.thresholds.minTemp / 100)}°C - {(product.thresholds.maxTemp / 100)}°C</p>
                            </div>

                            <div className="bg-[#0f1115] p-4 rounded-lg border border-gray-800">
                                <p className="text-gray-500 text-sm mb-1">Humidity</p>
                                <p className={`text-3xl font-bold ${product.alertActive ? 'text-red-400' : 'text-secondary'}`}>
                                    {(product.latestReading.humidity / 100).toFixed(2)} %
                                </p>
                            </div>
                        </div>

                        <h4 className="text-sm text-gray-400 mb-4 font-semibold uppercase tracking-wider">Historical Data</h4>
                        <TemperatureChart
                            data={product.readingHistory}
                            maxTemp={product.thresholds.maxTemp / 100}
                            minTemp={product.thresholds.minTemp / 100}
                        />
                    </div>
                </div>

                {/* Right Column: Details & Audit Trail */}
                <div className="space-y-8 col-span-1">
                    <div className="bg-surface p-6 rounded-xl border border-gray-800 shadow-xl print-hidden md:hidden mb-8">
                        <h3 className="font-semibold mb-4 text-center">Track on Mobile</h3>
                        <div className="flex justify-center">
                            <QRCodeComponent url={currentUrl} />
                        </div>
                    </div>

                    <div className="bg-surface p-6 rounded-xl border border-gray-800 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Immutable Audit Trail</h3>
                        <div className="space-y-4">
                            {product.readingHistory.slice().reverse().map((reading: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-start relative pl-4 border-l-2 border-gray-800">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#0f1115] border-2 border-primary"></div>
                                    <div>
                                        <p className="text-sm font-mono text-gray-400">{reading.timestamp}</p>
                                        <p className="text-sm">
                                            <span className="text-primary">{reading.temperature.toFixed(2)}°C</span> | <span className="text-secondary">{reading.humidity.toFixed(0)}%</span>
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Lat: {reading.lat.toFixed(4)}, Lon: {reading.lon.toFixed(4)}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pl-4 text-xs text-gray-600 font-mono mt-4">
                                Signatures verified on Solana Blockchain
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
