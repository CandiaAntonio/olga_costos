import { prisma } from '@/lib/db';

export type TimeRange = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';

export interface MarketHistoryPoint {
    date: Date;
    price: number;
}

export async function getMarketHistory(symbol: string, range: TimeRange): Promise<MarketHistoryPoint[]> {
    let startDate = new Date();

    switch (range) {
        case '1D':
            startDate.setDate(startDate.getDate() - 2); // Get a bit more for context or intraday if available
            break;
        case '5D':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '1M':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case '6M':
            startDate.setMonth(startDate.getMonth() - 6);
            break;
        case '1Y':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        case '5Y':
            startDate.setFullYear(startDate.getFullYear() - 5);
            break;
        case 'ALL':
            startDate = new Date(0);
            break;
    }

    const data = await prisma.marketPrice.findMany({
        where: {
            symbol: symbol,
            date: {
                gte: startDate
            }
        },
        orderBy: {
            date: 'asc'
        },
        select: {
            date: true,
            price: true
        }
    });

    return data.map(d => ({
        date: d.date,
        price: d.price
    }));
}

export async function getLatestPrice(symbol: string) {
    return await prisma.marketPrice.findFirst({
        where: { symbol },
        orderBy: { date: 'desc' }
    });
}
