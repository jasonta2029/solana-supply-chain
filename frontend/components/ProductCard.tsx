import React from 'react';
import Link from 'next/link';
import { Card } from './Card';
import { Thermometer, Droplets, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <Card featured={alertActive} className="group">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold font-sans tracking-tight mb-1 group-hover:text-accent transition-colors">
                                {name}
                            </h3>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground truncate w-48">
                                ID: {id.slice(0, 16)}...
                            </p>
                        </div>

                        {alertActive ? (
                            <div className="flex h-10 w-10 rounded-xl bg-red-500/10 items-center justify-center text-red-500">
                                <AlertTriangle className="w-5 h-5 animate-pulse" />
                            </div>
                        ) : (
                            <div className="flex h-10 w-10 rounded-xl bg-accent/5 items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-accent/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Thermometer className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-mono font-bold tracking-tight">Temp</span>
                            </div>
                            <p className={`text-2xl font-bold font-sans ${alertActive ? 'text-red-500' : 'text-foreground'}`}>
                                {(latestTemp / 100).toFixed(1)}°C
                            </p>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-accent/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Droplets className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-mono font-bold tracking-tight">Humid</span>
                            </div>
                            <p className="text-2xl font-bold font-sans">
                                {(latestHum / 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {alertActive && (
                        <div className="mt-6 pt-6 border-t border-red-500/10 flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                            Immediate Action Required
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
};
