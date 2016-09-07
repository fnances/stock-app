

export default class StockAppController {
  constructor (apiConnect, dataMining, filter) {
    this.apiConnect = apiConnect;
    this.dataMining = dataMining;
    this.filter = filter;
    this.stocks = [];
    this.stocksToDisplay = [];
    this.stockSymbols = [];
  }
  $onInit () {
    this.apiConnect.getStockInfo().then(res => {
      this.stockSymbols = this.dataMining.getStocks(res);
      this.stocks = res;
      this.filter.updateStocks(res);
    });
    this.date = {
      to: "",
      from: "",
      maxDate: "",
      minDate: ""
    };

  }
  filterStocksByNameOfCompany () {
    this.stocksToDisplay = this.filter.filterBySymbol(this.selectedStock);

    const { highestDate, lowestDate } = this.filter.getHighestAndLowestDatePossible();
    this.date.maxDate = highestDate;
    this.date.minDate = lowestDate;

    if (this.date.to || this.date.from) {
      this.onDateChange();
    }
  }
  onDateChange () {
    this.stocksToDisplay = this.filter.filterByDate(this.date);
  }

}


StockAppController.$inject = ["apiConnect", "dataMining", "filter"];
