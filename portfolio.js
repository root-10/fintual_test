class Company {
  constructor(name) {
    this.name = name;
  }
}

class Stock {
  constructor(company, ticker, name) {
    this.company = company;
    this.ticker = ticker;
    this.name = name;
    this.price = null;
  }

  currentPrice(lastAvailablePrice) {
    this.price = lastAvailablePrice;
    return this.price;
  }
}

class Position {
  constructor(stock, quantity = 0) {
    this.stock = stock;
    this.quantity = quantity;
  }

  marketValue() {
    if (this.stock.price === null)
      throw new Error(`Current price is not available for ${this.stock.ticker}`);
    return this.quantity * this.stock.price;
  }
}

class Allocation {
  constructor(stock, percentage) {
    this.stock = stock;
    this.percentage = percentage;
  }
}

class Portfolio {
  constructor() {
    this.stocks = new Map();
    this.positions = new Map();
    this.allocations = new Map();
  }

  addPosition(stock, quantity) {
    this.stocks.set(stock.ticker, stock);
    const existingPosition = this.positions.get(stock.ticker);
    if (existingPosition) {
      existingPosition.quantity += quantity;
      return existingPosition;
    }
    const position = new Position(stock, quantity);
    this.positions.set(stock.ticker, position);
    return position;
  }

  setAllocation(stock, percentage) {
    this.stocks.set(stock.ticker, stock);
    const allocation = new Allocation(stock, percentage);
    this.allocations.set(stock.ticker, allocation);
    return allocation;
  }

  updatePrices(lastAvailablePrices) {
    for (const stock of this.stocks.values()) {
      stock.currentPrice(lastAvailablePrices[stock.ticker]);
    }
  }

  totalValue() {
    return [...this.positions.values()].reduce(
      (total, position) => total + position.marketValue(), 0
    );
  }

  rebalance() {
    const totalValue = this.totalValue();
    if (totalValue === 0)
      return [];
    const orders = [];
    for (const stock of this.stocks.values()) {
      if (stock.price === null)
        throw new Error(`Current price is not available for ${stock.ticker}`);
      const allocation = this.allocations.get(stock.ticker);
      const targetPercentage = allocation ? allocation.percentage : 0;
      const targetValue = totalValue * targetPercentage;
      const position = this.positions.get(stock.ticker);
      const currentValue = position ? position.marketValue() : 0;
      const difference = targetValue - currentValue;
      if (Math.abs(difference) < 0.01)
        continue;
      const quantity = Math.abs(difference) / stock.price;
      orders.push({
        ticker: stock.ticker,
        action: difference > 0 ? 'BUY' : 'SELL',
        quantity,
        price: stock.price,
        value: Math.round(quantity * stock.price * 100) / 100
      });
    }
    return orders;
  }
}

module.exports = {
  Company,
  Stock,
  Position,
  Allocation,
  Portfolio
};
