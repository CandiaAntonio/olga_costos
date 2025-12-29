'use client';

import { MarketItem } from '@/lib/market-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

interface MarketCardProps {
    item: MarketItem;
    onClick?: () => void;
    isSelected?: boolean;
}

export function MarketCard({ item, onClick, isSelected }: MarketCardProps) {
    const isPositive = item.change > 0;
    const isNegative = item.change < 0;
    const isNeutral = item.change === 0;

    // Determine unit label
    let unitLabel = '';
    if (item.symbol === 'XAU' || item.symbol === 'XAG') {
        unitLabel = 'USD/oz';
    } else if (item.symbol === 'USD') {
        unitLabel = 'COP';
    }

    return (
        <Card
            className={`overflow-hidden border shadow-sm hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-primary border-primary' : ''
                }`}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
                <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    {item.name}
                </CardTitle>
                <div className="text-xs font-mono text-muted-foreground">{unitLabel}</div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-2xl font-bold font-mono tracking-tight">
                            {item.currency === 'USD' ? '$' : ''}
                            {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {item.currency !== 'USD' ? ` ${item.currency}` : ''}
                        </div>
                        <div className="flex items-center space-x-2 text-xs mt-1">
                            <span className={`font-mono font-medium flex items-center ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
                                {isPositive && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                                {isNegative && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                                {isNeutral && <MinusIcon className="h-3 w-3 mr-1" />}
                                {isPositive ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
