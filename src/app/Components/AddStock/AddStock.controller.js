

export default class AddStockController {
  $onInit () {
    this.initState = {
      symbol: "",
      date: "",
      low: "",
      open: "",
      close: "",
      adj_close: "",
      high: "",
      volume: ""
    };
    this.state = Object.assign({}, this.initState);

    this.demoStock = {
      symbol: "CSCO",
      date: "2016-05-22",
      low: 21,
      open: 22,
      close: 31,
      adj_close: 30,
      high: 33,
      volume: 22222
    };

  }
  addStock () {
    const { state } = this;
    const clone = Object.assign({}, state);
    const formFilled = Object.keys(state).every(key => (clone[key].toString().length > 0));
    if (!formFilled) { return; }

    this.onAddStock({ $event: this.state });
    this.cancel();
  }
  setDemoStock () {
    this.state = Object.assign({}, this.demoStock);
  }
  onCancel () {
    this.state = Object.assign({}, this.initState);

    this.cancel();
  }

}
