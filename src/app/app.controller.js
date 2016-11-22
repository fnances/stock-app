

export default class StockAppController {
  constructor ($scope, apiConnect, stockUtils, d3Service) {
    this.$scope = $scope;
    this.apiConnect = apiConnect;
    this.stockUtils = stockUtils;
    this.d3Service = d3Service;

    this.state = {
      showDateWarning: false,
      showModal: false,
      d3IsReady: false,
      selectedTab : "graph",
      clickedStock: "",
      stocks: [],
      refresh: true,
      stockSymbols: [],
      selectedSymbol: "CSCO",
      date: {
        to: null,
        from: null,
        maxDate: "",
        minDate: ""
      }
    };
    this.removeStock = this.removeStock.bind(this);
    this.filterByDate = this.filterByDate.bind(this);

  }
  $onInit () {
    const { selectedSymbol } = this.state;
    this.apiConnect.getStockInfo().then(res => {

      this.state.stocks = this.stockUtils.splitBySymbols(res);
      this.state.stockSymbols = Object.keys(this.state.stocks);
      this.state.stocksToDisplay = this.state.stocks[selectedSymbol];
      this.state.clickedStock = this.state.stocksToDisplay[0];

      this.setNewMaxMinDate();
    });

    this.d3Service.d3().then(() => {
      this.state.d3IsReady = true;
    });

  }
  setNewMaxMinDate () {
    const { maxAndMin } = this.stockUtils;
    const { selectedSymbol } = this.state;
    const { from, to} = this.state.date;
    const { maxDate, minDate } = maxAndMin(this.state.stocks[selectedSymbol]);


    this.state.date.maxDate = maxDate;
    this.state.date.minDate = minDate;
    this.state.date.to =  to  || maxDate;
    this.state.date.from = from || minDate;
  }
  selectTab (tab) {
    this.state.selectedTab = tab;
  }

  onDateChange () {
    const { selectedSymbol } = this.state;
    const { from, to } = this.state.date;
    const { validDate } = this;
    if (!validDate(from, to)) {
      this.state.showDateWarning = true;
      this.setNewMaxMinDate();
      return;
    }
    const newStocks = this.filterByDate([...this.state.stocks[selectedSymbol]]);
    this.state.stocksToDisplay = newStocks;

  }
  validDate (from, to) {
    if (from && to) {
      return (Date.parse(from) <= Date.parse(to));
    }
  }
  addStock (stock) {
    const { symbol } = stock;
    const { stocks, selectedSymbol } = this.state;
    const newStocks = [...stocks[symbol], stock];
    this.state.stocks[symbol] = newStocks;

    this.state.stocksToDisplay = this.filterByDate([...this.state.stocks[selectedSymbol]]);
    this.setNewMaxMinDate();
  }
  stockEquals (stock, stock2) {
    for (let key in stock) {
      if (key !== "color" && stock[key] !== stock2[key]) {
        return false;
      }
    }
    return true;
  }
  removeStock () {
    const { stockEquals, filterByDate } = this;
    const { stocks, clickedStock } = this.state;
    const { symbol } = clickedStock;


    const newStocksForSymbol = stocks[symbol]
      .filter(stock => !stockEquals(stock, clickedStock));

    this.state.stocksToDisplay = filterByDate(newStocksForSymbol);

    this.state.clickedStock = "";
    this.state.selectedTab = "chart";
    this.setNewMaxMinDate();

  }
  showAddStock () {
    this.state.showModal = true;
  }
  cancel () {
    this.state.showModal = false;
  }
  onStockClick (stock) {
    this.state.clickedStock = stock;
    this.state.selectedTab = "table";
    this.$scope.$apply();

  }
  filterByDate (stocks) {
    const { from, to } = this.state.date;
    const { filterDateFrom, filterDateTo } = this.stockUtils;
    let stocksFiltered = [];

    if (from) {
      stocksFiltered = filterDateFrom(stocks, from);
    }
    if (to) {
      stocksFiltered = filterDateTo(stocksFiltered, to);
    }
    return stocksFiltered;
  }
  adjustDate ([from, to]) {
    this.state.date.from = from;
    this.state.date.to = to;
    this.state.stocksToDisplay = this.filterByDate([...this.state.stocksToDisplay]);
    this.$scope.$apply();
  }
  onStockSelect () {
    const { stocks, selectedSymbol } = this.state;
    this.state.stocksToDisplay = stocks[selectedSymbol];
    this.onDateChange();
    this.setNewMaxMinDate();
  }
}


StockAppController.$inject = ["$scope", "apiConnect", "stockUtils", "d3Service"];
