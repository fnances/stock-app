

export default class StockAppController {
  constructor (apiConnect, stockUtils, $scope) {
    this.apiConnect = apiConnect;
    this.stockUtils = stockUtils;

    this.$scope = $scope;
    this.state = {
      showDateWarning: false,
      showModal: false,
      selectedTab : "graph",
      clickedStock: "",
      stocks: [],
      refresh: true,
      stockSymbols: [],
      selectedSymbol: "CSCO",
      stocksToDisplay: [],
      date: {
        to: null,
        from: null,
        maxDate: "",
        minDate: ""
      }
    };
  }
  $onInit () {
    const { selectedSymbol } = this.state;

    this.apiConnect.getStockInfo().then(res => {
      this.state.stocks = this.stockUtils.splitBySymbols(res);
      this.state.stockSymbols = Object.keys(this.state.stocks);
      this.state.stocksToDisplay = this.state.stocks[selectedSymbol];
      this.setNewMaxMinDate();
      this.state.clickedStock = this.state.stocksToDisplay[0];
    });

  }
  setNewMaxMinDate () {
    const { maxAndMin } = this.stockUtils;
    const { selectedSymbol } = this.state;
    const { maxDate, minDate } = maxAndMin(this.state.stocks[selectedSymbol]);

    const { from, to } = this.state.date;

    this.state.date = Object.assign({}, this.state.date, { maxDate, minDate });

    this.state.date.to = to || new Date(maxDate);
    this.state.date.from = from || new Date(minDate);

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

    this.state.stocksToDisplay = this.filterByDate(this.state.stocks[selectedSymbol]);

  }
  validDate (from, to) {
    if (from && to) {
      return (Date.parse(from) <= Date.parse(to));
    }
  }
  addStock (stock) {
    const { symbol } = stock;
    const { stocks, selectedSymbol } = this.state;

    const { sortStocksByDate } = this.stockUtils;
    this.state.stocks[symbol] = sortStocksByDate([...stocks[symbol], stock]);

    this.state.stocksToDisplay = this.filterByDate(this.state.stocks[selectedSymbol]);
    this.setNewMaxMinDate();
  }
  removeStock () {

    const { stocks, clickedStock, selectedSymbol } = this.state;
    const { symbol } = clickedStock;
    this.state.stocks[symbol] = stocks[symbol].filter(stock => stock !== clickedStock);

    this.state.stocksToDisplay = this.filterByDate(this.state.stocks[selectedSymbol]);

    this.state.clickedStock = "";
    this.state.selectedTab = "chart";

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

    this.state.stocksToDisplay = this.filterByDate(this.state.stocksToDisplay);
    this.$scope.$apply();
  }
  onStockSelect () {
    const { stocks, selectedSymbol } = this.state;
    this.state.stocksToDisplay = stocks[selectedSymbol];
    this.onDateChange();
    this.setNewMaxMinDate();
  }
}


StockAppController.$inject = ["apiConnect", "stockUtils", "$scope"];
