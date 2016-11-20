

export default class StockUtils {
  constructor () {
    this.avoidProperty = ["symbol", "date"];
    this.parseObjectToNum = this.parseObjectToNum.bind(this);
  }
  splitBySymbols (rawStocks) {
    const stocks = {};
    rawStocks.forEach(stock => {
      const { Symbol } = stock;
      if (!angular.isArray(stocks[Symbol])) {
        stocks[Symbol] = [];
      }
      stocks[Symbol].push(this.parseObjectToNum(stock));

    });

    const objWithSortedDatesAscending = Object
      .keys(stocks)
      .reduce((curr, next) => {
        curr[next] = stocks[next].reverse();
        return curr;
      }, {});

    return objWithSortedDatesAscending;
  }
  parseObjectToNum (stock) {
    const { roundTo } = this;
    const newStock = {};
    Object.keys(stock).forEach(key => {
      let newKey = key.toLowerCase();

      if (!this.avoidProperty.includes(newKey)) {
        newStock[newKey] = roundTo(stock[key], 2);
        return;
      }
      newStock[newKey] = stock[key];
    });
    return newStock;
  }
  maxAndMin (stocks) {
    const dates = stocks.map(stock => Date.parse(stock.date));

    return {
      maxDate: new Date(Math.max(...dates)),
      minDate: new Date(Math.min(...dates))
    };
  }
  filterDateFrom (stocks, from) {
    return stocks.filter(stock => Date.parse(stock.date) >= from);
  }
  filterDateTo (stocks, to) {
    return stocks.filter(stock => Date.parse(stock.date) <= to);
  }

  sortStocksByDate (stocks) {
    const compareFunc = (a, b) => Date.parse(b.Date) - Date.parse(a.Date);

    return [...stocks].sort(compareFunc);
  }
  roundTo (num, places) {
    return +(Math.round(num + "e+" + places)  + "e-" + places);
  }
}
