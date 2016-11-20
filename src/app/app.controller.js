

export default class StockAppController {
  constructor (apiConnect, stockUtils) {
    this.apiConnect = apiConnect;
    this.stockUtils = stockUtils;

    this.state = {
      showDateWarning: false,
      showModal: false,
      selectedTab : "graph",
      stocks: [],
      stockSymbols: [],
      selectedSymbol: "CSCO",
      stocksToDisplay: [],
      date: {
        to: "",
        from: "",
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
    });

  }
  setNewMaxMinDate () {
    const { maxAndMin } = this.stockUtils;

    const { maxDate, minDate } = maxAndMin(this.state.stocksToDisplay);

    this.state.date = Object.assign({}, this.state.date, { maxDate, minDate });
    this.state.date.to = new Date(maxDate);
    this.state.date.from = new Date(minDate);

  }
  selectTab (tab) {
    this.state.selectedTab = tab;
  }
  onDateChange () {
    const { from, to } = this.state.date;
    const { validDate, state: { stocks, selectedSymbol } } = this;
    const { filterDateFrom, filterDateTo } = this.stockUtils;

    const selectedStock = stocks[selectedSymbol];

    if (!validDate(from, to)) {
      this.state.showDateWarning = true;
      this.setNewMaxMinDate();
      return;
    }

    if (from) {
      this.state.stocksToDisplay = filterDateFrom(selectedStock, from);
    }
    if (to) {
      this.state.stocksToDisplay = filterDateTo(this.state.stocksToDisplay, to);
    }
  }
  validDate (from, to) {
    if (from && to) {
      return (Date.parse(from) <= Date.parse(to));
    }
  }
  addStock (stock) {
    const { symbol } = stock;
    const { stocks, selectedSymbol } = this.state;

    const sortStocksByDate = this.stockUtils.sortStocksByDate;
    this.state.stocks[symbol] = sortStocksByDate([...stocks[symbol], stock]);
    if (symbol === selectedSymbol) {
      this.state.stocksToDisplay = this.state.stocks[symbol];
    }
    this.setNewMaxMinDate();
  }
  showAddStock () {
    this.state.showModal = true;
  }
  cancel () {
    this.state.showModal = false;
  }
  onStockChange () {
    const { stocks, selectedSymbol } = this.state;
    this.state.stocksToDisplay = stocks[selectedSymbol];
    this.setNewMaxMinDate();
  }
}


StockAppController.$inject = ["apiConnect", "stockUtils"];
