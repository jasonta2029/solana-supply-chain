import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function Home() {
    // In a full implementation, we would use Connection object to fetch all Program Accounts
    // using getProgramAccounts and filter by the Product discriminator.
    // For the demo, we will show a placeholder or mock active products.

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Solana Supply Chain Tracker
                </h1>
                <div className="flex gap-4 items-center">
                    <Link href="/register" className="btn-primary">
                        Register Product
                    </Link>
                    <WalletMultiButton className="!bg-surface !hover:bg-gray-800" />
                </div>
            </header>

            <main>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Live Shipments</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock Product Cards for Demo - Replace with real on-chain data parsing */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-surface rounded-xl border border-gray-800">
                        <h3 className="text-xl text-gray-400 mb-4">No active shipments found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">Connect your wallet and register a new product to start tracking your supply chain on Solana Devnet.</p>
                        <Link href="/register" className="btn-primary inline-block">
                            Register First Product
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
