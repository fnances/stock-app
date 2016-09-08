

export default class ApiConnect {
  constructor ($http) {
    this.$http = $http;
    this.apiEndpoint = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20(%27CSCO%27%2C%27MSFT%27%2C%27ADBE%27)%20and%20startDate%20%3D%20%272016-01-20%27%20and%20endDate%20%3D%20%272016-07-20%27&format=json&diagnostics=true&env=http://datatables.org/alltables.env"
  }

  getStockInfo () {
    const { $http, apiEndpoint } = this;
    return $http.get(apiEndpoint).then(response => response.data.query.results.quote);
  }
}


ApiConnect.$inject = ["$http"];
