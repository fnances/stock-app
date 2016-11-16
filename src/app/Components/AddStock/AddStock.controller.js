

export default class AddStockController {
  $onInit () {
    this.initState = {
      stock: "",
      date: "",
      low: "",
      high: "",
      volume: ""
    };
    this.state = Object.assign({}, this.initState);

  }
  addStock () {
    this.onAddStock({ $event: this.state });
    this.state = Object.assign({}, this.initState);

    this.cancel();
  }

}
