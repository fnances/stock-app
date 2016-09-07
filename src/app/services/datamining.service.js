

export default class DataMining {
  getStocks (stocks) {
    this.stocks = stocks;
    const possibleStocks = [];
    stocks.forEach(stock => {
      const { Symbol } = stock;
      if (!possibleStocks.includes(Symbol)) {
        possibleStocks.push(Symbol);
      }
    });
    return possibleStocks;
  }
}
