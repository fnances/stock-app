

export default class DataManipulation {
  constructor () {
    this.filteredBySymbol = [];
    this.dateTo = "";
    this.dateFrom = "";
    this.dontParse = ["Date"];
    this.filterFunctions = {
      from: stock => stock.Date >= this.dateFrom,
      to: stock => stock.Date <= this.dateTo,
      fromAndTo: stock => {
        const { Date } = stock;
        const { dateFrom, dateTo } = this;
        return Date >= dateFrom && Date <= dateTo;
      }
    };
  }
  filterByDate (dateRange) {
    const { from, to } = dateRange;
    let stocksFiltered = [];
    const { filteredBySymbol, filterFunctions } = this;
    this.dateFrom = from;
    this.dateTo = to;

    if(!!from && !!to) {
      const stocksFiltered = filteredBySymbol.filter(filterFunctions["fromAndTo"]);
      return stocksFiltered;
    }

    const filterFunction = (from) ? filterFunctions["from"] : filterFunctions["to"];
    stocksFiltered = filteredBySymbol.filter(filterFunction);

    return stocksFiltered;
  }
  filterBySymbol (stocks, stockSymbol) {
    const filteredBySymbol = stocks.filter(stock => stock.Symbol === stockSymbol);
    this.filteredBySymbol = this.sortStocksByDate(filteredBySymbol);
    return this.filteredBySymbol;
  }
  getDateRangeForSelectedStock () {
    const dates = this.filteredBySymbol.map(stock => stock.Date);

    return {
      highestDate: new Date(Math.max(...dates)),
      lowestDate: new Date(Math.min(...dates))
    };
  }
  sortStocksByDate (stocks) {
    const compareFunc = (a, b) => a.Date - b.Date;
    return stocks.sort(compareFunc);
  }
  parseDataToNumbers (stocks) {
    const parsedData = stocks.map(stock => {
      const parsedStock = {};
      for (let prop in stock) {
        if (this.dontParse.includes(stock[prop])) { return; }
        parsedStock[prop] = this.roundTo(stock[prop], 2);
      }
      return parsedStock;
    });
    return parsedData;
  }
  pushToNotToParse (property) {
    this.dontParse.push(property);
  }
  getStocks (stocks) {
    let stockOptions = [];
    stocks.forEach(stock => {
      const { Symbol } = stock;
      if (!stockOptions.includes(Symbol)) {
        stockOptions.push(Symbol);
      }
    });
    this.stockOptions = stockOptions;
    return stockOptions;
  }
  roundTo (num, places) {
    return +(Math.round(num + "e+" + places)  + "e-" + places);
  }
}
