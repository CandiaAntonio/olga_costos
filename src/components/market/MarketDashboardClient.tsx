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
    const [hoveredData, setHoveredData] = useState<{ price: number; change: number; changePercent: number; date: Date } | null>(null);

    const items = [data.gold, data.silver, data.usd];

    // Helper to get display item (either real data or hovered data if selected)
    const getDisplayItem = (item: MarketItem) => {
        if (item.symbol === selectedItem.symbol && hoveredData) {
            return {
                ...item,
                price: hoveredData.price,
                change: hoveredData.change,
                changePercent: hoveredData.changePercent
            };
        }
        return item;
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.symbol}
                        className="cursor-pointer"
                    >
                        <MarketCard
                            item={getDisplayItem(item)}
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
                    onHover={setHoveredData}
                />
            </div>


        </div>
    );
}
