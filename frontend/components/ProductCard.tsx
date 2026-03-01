import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
    id: string;
    name: string;
    latestTemp: number;
    latestHum: number;
    alertActive: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, name, latestTemp, latestHum, alertActive }) => {
    return (
        <Link href={`/product/${id}`}>
            <div className={`p-6 rounded-lg shadow-lg border transition-all hover:scale-[1.02] cursor-pointer ${alertActive ? 'border-red-500 bg-red-900/20' : 'border-surface bg-surface'}`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-sans text-white truncate w-[80%]">{name}</h3>
                    {alertActive && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                            ALERT
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-gray-400">
                        <span>Temperature:</span>
                        <span className={alertActive ? 'text-red-400' : 'text-primary'}>
                            {(latestTemp / 100).toFixed(2)} °C
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Humidity:</span>
                        <span className={alertActive ? 'text-red-400' : 'text-primary'}>
                            {(latestHum / 100).toFixed(2)} %
                        </span>
                    </div>
                </div>

                <div className="mt-4 text-xs tracking-wider text-gray-500 font-mono truncate">
                    ID: {id}
                </div>
            </div>
        </Link>
    );
};
