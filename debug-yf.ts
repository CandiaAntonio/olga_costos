const yahooFinance = require('yahoo-finance2');

console.log('Type of module:', typeof yahooFinance);
console.log('Keys:', Object.keys(yahooFinance));
if (yahooFinance.default) {
    console.log('Type of default:', typeof yahooFinance.default);
    console.log('Keys of default:', Object.keys(yahooFinance.default));
    console.log('Is default a constructor?', typeof yahooFinance.default === 'function' && /^\s*class\s+/.test(yahooFinance.default.toString()));
}
