

export default class StockAppController {
  constructor (apiConnect, dataManipulation) {
    this.apiConnect = apiConnect;
    this.dataManipulation = dataManipulation;
    this.stocks = [];
    this.selectedStock = "CSCO";
    this.stocksToDisplay = [];
    this.stockSymbols = [];
  }
  $onInit () {
    this.apiConnect.getStockInfo().then(res => {
      this.stockSymbols = this.dataManipulation.getStocks(res);
      this.stocks = this.dataManipulation.parseDataToNumbers(res);
      this.onStockChange();
    });
    this.date = {
      to: "",
      from: "",
      maxDate: "",
      minDate: ""
    };

  }
  onStockChange () {
    this.stocksToDisplay = this.dataManipulation.filterBySymbol(this.stocks, this.selectedStock);
    const { highestDate, lowestDate } = this.dataManipulation.getDateRangeForSelectedStock();
    this.date.maxDate = highestDate;
    this.date.minDate = lowestDate;

    if (this.date.to || this.date.from) {
      this.onDateChange();
    }
  }
  onDateChange () {
    this.stocksToDisplay = this.dataManipulation.filterByDate(this.date);
  }

}


StockAppController.$inject = ["apiConnect", "dataManipulation"];
