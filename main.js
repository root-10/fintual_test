const { Company, Stock, Portfolio } = require('./portfolio');

// Companies
const apple = new Company('Apple Inc.');
const meta = new Company('Meta Platforms Inc.');

// Stocks
const appleStock = new Stock(apple, 'AAPL', 'Apple');
const metaStock = new Stock(meta, 'META', 'Meta');

// Portfolio
const portfolio = new Portfolio();

// Positions
portfolio.addPosition(appleStock, 60);
portfolio.addPosition(metaStock, 40);

// Market prices
portfolio.updatePrices({
  [appleStock.ticker]: 100,
  [metaStock.ticker]: 500
});

// Target allocation
portfolio.setAllocation(appleStock, .6);
portfolio.setAllocation(metaStock, .4);

// Current prices
console.log('Current prices:');
console.log(`${appleStock.ticker}: $${appleStock.price}`);
console.log(`${metaStock.ticker}: $${metaStock.price}`);
console.log('---------------------');

// Position market values
console.log('Position market values:');
console.log(`AAPL: $${portfolio.positions.get(appleStock.ticker).marketValue()}`);
console.log(`META: $${portfolio.positions.get(metaStock.ticker).marketValue()}`);
console.log('---------------------');

// Portfolio value
console.log(`Current portfolio value:`);
console.log(portfolio.totalValue());
console.log('---------------------');

// Rebalance
const orders = portfolio.rebalance();
console.log('Rebalance orders:');
console.log(orders);