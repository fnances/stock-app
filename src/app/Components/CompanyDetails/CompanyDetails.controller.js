

export default class CompanyDetailsController {
  $onChanges (changes) {
    if (!this.companyStocks) { return; }

    if (changes.company) {
      this.company = this.company;
    }
    if (changes.companyStocks) {
      this.companyStocks = [...this.companyStocks];
    }
    this.companyAverageVolume = this.companyStocks
      .map(stock => stock.volume)
      .reduce((sum, value, array, i) => {
        sum += value;
        return (i + 1 === array.length) ? sum / array.length : sum;
      }, 0);
    this.firstStock = this.companyStocks[0];
    this.lastStock = this.companyStocks[this.companyStocks.length - 1];
  }


}
