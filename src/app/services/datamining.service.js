

export default class DataMining {
  constructor () {

  }
  getStocks (stocks) {
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
