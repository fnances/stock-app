

export default class Filter {
  constructor () {
    this.filteredBySymbol = [];
    this.stocksInCache = [];
    this.dateTo = "";
    this.dateFrom = "";
    this.filterFunctions = {
      from: stock => Date.parse(stock.Date) >= this.dateFrom,
      to: stock => Date.parse(stock.Date) <= this.dateTo,
      fromAndTo: stock => {
        const date = Date.parse(stock.Date);
        const { dateFrom, dateTo } = this;
        return date >= dateFrom && date <= dateTo;
      }
    };
  }
  updateStocks (updatedStocks) {
    this.stocksInCache = updatedStocks;
    return this;
  }
  filterByDate (dateRange) {
    const { from, to } = dateRange;
    let stocksFiltered = [];
    const { filteredBySymbol, filterFunctions } = this;
    this.dateFrom = Date.parse(from);
    this.dateTo = Date.parse(to);

    if(!!from && !!to) {
      const stocksFiltered = filteredBySymbol.filter(filterFunctions["fromAndTo"]);
      return stocksFiltered;
    }

    const filterFunction = (from) ? filterFunctions["from"] : filterFunctions["to"];
    stocksFiltered = filteredBySymbol.filter(filterFunction);

    return stocksFiltered;
  }
  filterBySymbol (stockSymbol) {
    const filteredBySymbol = this.stocksInCache.filter(stock => stock.Symbol === stockSymbol);
    this.filteredBySymbol = this.sortStocksByDate(filteredBySymbol);
    return this.sortStocksByDate(this.filteredBySymbol);
  }
  getHighestAndLowestDatePossible () {
    const dates = this.filteredBySymbol.map(stock => Date.parse(stock.Date));

    return {
      highestDate: new Date(Math.max(...dates)),
      lowestDate: new Date(Math.min(...dates))
    };
  }
  sortStocksByDate (stocks) {
    const compareFunc = (a, b) => Date.parse(a.Date) - Date.parse(b.Date);
    return stocks.sort(compareFunc);
  }
}
