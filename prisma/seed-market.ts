import { PrismaClient } from '@prisma/client';
// @ts-ignore
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const prisma = new PrismaClient();

async function seedMarketData() {
    console.log("Starting market data seed...");

    // Symbols: Gold (GC=F), Silver (SI=F), USD/COP (COP=X)
    const symbols = [
        { yfSymbol: 'GC=F', dbSymbol: 'XAU', name: 'Oro' },
        { yfSymbol: 'SI=F', dbSymbol: 'XAG', name: 'Plata' },
        { yfSymbol: 'COP=X', dbSymbol: 'USD', name: 'Dólar' }
    ];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5); // 5 years ago

    for (const { yfSymbol, dbSymbol, name } of symbols) {
        try {
            console.log(`Fetching data for ${dbSymbol} (${yfSymbol})...`);

            const queryOptions = { period1: startDate, period2: endDate };
            const result = await yahooFinance.historical(yfSymbol, queryOptions);

            if (!result || result.length === 0) {
                console.warn(`No data found for ${dbSymbol}`);
                continue;
            }

            console.log(`Found ${result.length} records for ${dbSymbol}. Saving to DB...`);

            // Batch insert for performance
            // SQLite variable limit is usually 999, so let's batch reasonably
            const batchSize = 100;
            for (let i = 0; i < result.length; i += batchSize) {
                const batch = result.slice(i, i + batchSize);

                await Promise.all(batch.map(async (record: any) => {
                    // Normalize date to start of day or ISO string
                    const date = new Date(record.date);

                    // Upsert to avoid duplicates
                    await prisma.marketPrice.upsert({
                        where: {
                            symbol_date: {
                                symbol: dbSymbol,
                                date: date
                            }
                        },
                        update: {
                            price: record.close,
                            open: record.open,
                            high: record.high,
                            low: record.low,
                            close: record.close
                        },
                        create: {
                            symbol: dbSymbol,
                            date: date,
                            price: record.close,
                            currency: dbSymbol === 'USD' ? 'COP' : 'USD', // Gold/Silver in USD, USD in COP
                            open: record.open,
                            high: record.high,
                            low: record.low,
                            close: record.close
                        }
                    });
                }));
            }

            console.log(`Saved ${dbSymbol} data.`);

        } catch (error) {
            console.error(`Error fetching/saving ${dbSymbol}:`, error);
        }
    }

    console.log("Market data seeding complete.");
}

seedMarketData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
