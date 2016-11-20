

export default class AddStockController {
  $onInit () {
    this.initState = {
      symbol: "",
      date: "",
      low: "",
      open: "",
      close: "",
      adjClose: "",
      high: "",
      volume: ""
    };
    this.state = Object.assign({}, this.initState);

  }
  addStock () {
    const { state } = this;
    const clone = Object.assign({}, state);
    const formFilled = Object.keys(state).every(key => (clone[key].toString().length > 0));
    if (!formFilled) { return; }

    this.onAddStock({ $event: this.state });
    this.state = Object.assign({}, this.initState);

    this.cancel();
  }
  onCancel () {
    this.state = Object.assign({}, this.initState);

    this.cancel();
  }

}
