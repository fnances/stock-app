

export default class StockAppController {
  constructor ($scope, apiConnect, dataMining) {
    this.apiConnect = apiConnect;
    this.dataMining = dataMining;
    this.$scope = $scope;
    this.stocks = "";
    this.stockSymbols = [];
    this.apiConnect.getStockInfo().then(res => {
      this.stockSymbols = this.dataMining.getStocks(res);
      this.stocks = res;
    });

  }

}


StockAppController.$inject = ["$scope", "apiConnect", "dataMining"];
