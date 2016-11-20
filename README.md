1. Create an application that shows a stock chart with stock prices over the past 6 months.
2. Give the user an option to select three different stocks to show on the chart.
3. Give the user an option to select the time period displayed on the chart with datepickers and shorten it using D3’s brush. This should adjust all relevant windows (see #6 below).
4. Add an option to add and remove stocks to the chart from the full list.
5. Give the user an option to click on any day in the chart and show the high & low prices for that day, as well as the volume traded.
6. Have 4 different windows
- A stock price graph over time
- A chart showing daily high/low prices and volume traded for each stock by day
- A table showing data for the selected stock.
- A panel showing company details for the selected stock.
7. You can use Bootstrap for styling, Angular Bootstrap library for components and D3.js for charts.


Yahoo API can provide stocks historical data. Please find an example of a query below:
http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20(%27CSCO%27%2C%27MSFT%27%2C%27ADBE%27)%20and%20startDate%20%3D%20%272016-01-20%27%20and%20endDate%20%3D%20%272016-07-20%27&format=json&diagnostics=true&env=http://datatables.org/alltables.env
