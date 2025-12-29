'use client';

import { useState } from 'react';
import { MarketCard } from '@/components/market/MarketCard';
import { MarketHistoryChart } from '@/components/market/MarketHistoryChart';
import { MarketData, MarketItem } from '@/lib/market-service';

interface MarketDashboardClientProps {
    data: MarketData;
}

export function MarketDashboardClient({ data }: MarketDashboardClientProps) {
    const [selectedItem, setSelectedItem] = useState<MarketItem>(data.gold);

    const items = [data.gold, data.silver, data.usd];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.symbol}
                        className="cursor-pointer"
                    >
                        <MarketCard
                            item={item}
                            isSelected={selectedItem.symbol === item.symbol}
                            onClick={() => setSelectedItem(item)}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <MarketHistoryChart
                    initialItem={data.gold}
                    selectedItem={selectedItem}
                />
            </div>

            <div className="text-sm text-muted-foreground mt-4">
                Última actualización: {new Date(data.lastUpdated).toLocaleString()}
                <br />
                Fuentes: Yahoo Finance (Datos históricos y en tiempo real).
            </div>
        </div>
    );
}
