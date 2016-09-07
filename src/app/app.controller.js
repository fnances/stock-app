

export default class StockAppController {
  constructor ($scope, apiConnect, dataMining) {
    this.apiConnect = apiConnect;
    this.dataMining = dataMining;
    this.$scope = $scope;
    this.stocks = [];
    this.stocksToDisplay = [];
    this.stockSymbols = [];
  }
  $onInit () {
    this.apiConnect.getStockInfo().then(res => {
      this.stockSymbols = this.dataMining.getStocks(res);
      this.stocks = res;
      this.stocksToDisplay = res;
    });
  }
  onStockChange (selectedStock) {
    this.stocksToDisplay = this.stocks.filter(stock => stock.Symbol === selectedStock);
  }

}


StockAppController.$inject = ["$scope", "apiConnect", "dataMining"];
